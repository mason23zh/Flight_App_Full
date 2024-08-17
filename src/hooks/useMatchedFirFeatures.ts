// This hook will fetch fir data,
// after processing the data it will return formatted GeoJson FeatureCollection,
// firData, and either loading state or error state.
// This hook will also check FSS and fetch all FIRs within its associated FSS.
// A flag called isInFSS in the properties will be added to indicate if FIR is a part of FSS.
// The complexity of this hook is high, might be improved in the future.
import { useEffect, useMemo, useState } from "react";
import { VatsimControllers, VatsimFirs } from "../types";
import GeoJson from "geojson";
import { useFetchVatsimFirQuery, useFetchVatsimFssQuery } from "../store";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";


interface UseMatchedFirFeaturesReturn {
    geoJsonFeatures: GeoJson.FeatureCollection,
    firData: VatsimFirs,
    isLoading: boolean,
    isError: FetchBaseQueryError | SerializedError
}


const useMatchedFirFeatures = (
    controllerInfo: VatsimControllers,
    geoJsonData: GeoJson.FeatureCollection
): UseMatchedFirFeaturesReturn => {
    const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJson.FeatureCollection>({
        type: "FeatureCollection",
        features: []
    });

    const {
        data: firData,
        error: firError,
        isLoading: firLoading
    } = useFetchVatsimFirQuery();

    const {
        data: fssData,
        error: fssError,
        isLoading: fssLoading
    } = useFetchVatsimFssQuery();

    const isLoading = fssLoading || firLoading;
    const isError = firError || fssError;

    useMemo(() => {
        console.log("use memo run useMathcedFirfeature");
        if (firLoading || firError || fssLoading || fssError || !geoJsonData || !controllerInfo) {
            setGeoJsonFeatures({
                type: "FeatureCollection",
                features: []
            });
            return;
        }

        let matchedFirs = {};

        if (controllerInfo.fir) {
            matchedFirs = controllerInfo.fir.reduce((acc, controller) => {
                const firKey = controller.firInfo.icao;
                const firInfoWithFlag = {
                    ...controller.firInfo,
                    isFss: false
                };
                if (!acc[firKey]) {
                    acc[firKey] = {
                        firKey: firKey,
                        controllers: [],
                        firInfo: firInfoWithFlag,
                        isInFss: false
                    };
                }
                acc[firKey].controllers.push({
                    name: controller.name,
                    frequency: controller.frequency,
                    logon_time: controller.logon_time,
                    callsign: controller.callsign
                });
                return acc;
            }, {});
        }

        // Check FSS data if available
        if (controllerInfo.fss && fssData) {
            controllerInfo.fss.forEach(fss => {
                const fssKey = fss.callsign.replace("_FSS", "");
                if (fssData[fssKey] && fssData[fssKey].firs) {
                    fssData[fssKey].firs.forEach(firKey => {
                        if (!matchedFirs[firKey]) {
                            const firInfo = firData[firKey];
                            if (firInfo) {
                                const firInfoWithFlag = {
                                    ...firInfo,
                                    isFss: true,
                                };
                                matchedFirs[firKey] = {
                                    firKey: firKey,
                                    controllers: [{
                                        name: fss.name,
                                        frequency: fss.frequency,
                                        logon_time: fss.logon_time,
                                        callsign: fss.callsign
                                    }],
                                    firInfo: firInfoWithFlag,
                                    isInFss: true
                                };
                            }
                        } else {
                            matchedFirs[firKey].isInFss = true;
                            matchedFirs[firKey].controllers.push({
                                name: fss.name,
                                frequency: fss.frequency,
                                logon_time: fss.logon_time,
                                callsign: fss.callsign
                            });
                        }
                    });
                } else {
                    // Handle the case where an FSS is actually an FIR with extended range
                    const parts = fss.callsign.replace("_FSS", "")
                        .split("_");
                    let matchFound = false;

                    while (parts.length > 0 && !matchFound) {
                        const potentialMatch = parts.join("_");
                        if (firData[potentialMatch]) {
                            const potentialMatchFirCode = firData[potentialMatch].fir;
                            const firInfoWithFlag = {
                                ...firData[potentialMatch],
                                isFss: true
                            };
                            if (!matchedFirs[potentialMatchFirCode]) {
                                matchedFirs[potentialMatchFirCode] = {
                                    firKey: potentialMatchFirCode,
                                    controllers: [],
                                    firInfo: firInfoWithFlag,
                                    isInFss: false
                                };
                            }
                            matchedFirs[potentialMatchFirCode].controllers.push({
                                name: fss.name,
                                frequency: fss.frequency,
                                logon_time: fss.logon_time,
                                callsign: fss.callsign
                            });
                            matchFound = true;
                        }
                        parts.pop();
                    }
                }
            });
        }


        const chunkSize = 50;
        let currentIndex = 0;
        const totalFeatures = geoJsonData.features.length;
        const processedFeatures = [];

        const processChunk = () => {
            const chunk = geoJsonData.features.slice(currentIndex, currentIndex + chunkSize);

            chunk.forEach(feature => {
                const firKey = Object.keys(matchedFirs)
                    .find(key => {
                        const matchedFir = matchedFirs[key];
                        return matchedFir.firInfo.fir === feature.properties.id ||
                                    matchedFir.firInfo.icao === feature.properties.id;
                    });

                if (firKey) {
                    const matchedFir = matchedFirs[firKey];
                    const isOceanicFeature = feature.properties.oceanic === "1";

                    // Check if FIR is associated with an FSS
                    if (matchedFir.firInfo.isFss) {
                        const existingFeatureIndex = processedFeatures.findIndex(f => f.properties.id === feature.properties.id);

                        if (existingFeatureIndex !== -1) {
                            const existingFeature = processedFeatures[existingFeatureIndex];

                            if (isOceanicFeature && existingFeature.properties.oceanic !== "1") {
                                // Replace with oceanic feature for FSS FIRs
                                processedFeatures[existingFeatureIndex] = {
                                    ...feature,
                                    key: `${feature.properties.id}-${firKey}`,
                                    properties: {
                                        ...feature.properties,
                                        controllers: matchedFirs[firKey].controllers,
                                        firInfo: matchedFirs[firKey].firInfo,
                                        isInFss: matchedFirs[firKey].isInFss
                                    }
                                };
                            }
                        } else {
                            processedFeatures.push({
                                ...feature,
                                key: `${feature.properties.id}-${firKey}`,
                                properties: {
                                    ...feature.properties,
                                    controllers: matchedFirs[firKey].controllers,
                                    firInfo: matchedFirs[firKey].firInfo,
                                    isInFss: matchedFirs[firKey].isInFss
                                }
                            });
                        }
                    } else {
                        // Handle FIRs not associated with FSS
                        const nonOceanicFeature = processedFeatures.find(f => f.properties.id === feature.properties.id && f.properties.oceanic === "0");

                        if (!nonOceanicFeature && !isOceanicFeature) {
                            processedFeatures.push({
                                ...feature,
                                key: `${feature.properties.id}-${firKey}`,
                                properties: {
                                    ...feature.properties,
                                    controllers: matchedFirs[firKey].controllers,
                                    firInfo: matchedFirs[firKey].firInfo,
                                    isInFss: matchedFirs[firKey].isInFss
                                }
                            });
                        }
                    }
                }
            });

            currentIndex += chunkSize;

            if (currentIndex < totalFeatures) {
                requestIdleCallback(processChunk);
            } else {
                setGeoJsonFeatures({
                    type: "FeatureCollection",
                    features: processedFeatures
                });
            }
        };

        requestIdleCallback(processChunk);
    }, [controllerInfo, geoJsonData, firData, fssData, firLoading, firError, fssLoading, fssError]);

    return {
        firData,
        geoJsonFeatures,
        isLoading,
        isError
    };
};

export default useMatchedFirFeatures;

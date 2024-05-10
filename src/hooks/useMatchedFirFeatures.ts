// This hook will fetch fir data,
// after processing the data it will return formatted GeoJson FeatureCollection,
// firData, and either loading state or error state.
// This hook will also check FSS and fetch all FIRs within its associated FSS.
// A flag called isInFSS in the properties will be added to indicate if FIR is a part of FSS.
// The complexity of this hook is high, might be improved in the future.
import { useMemo, useState } from "react";
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
) => {
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

    console.log(controllerInfo.fss);

    // console.log("FSS INFO:", controllerInfo.fss);
    // console.log("FIR INFO:", controllerInfo.fir);


    useMemo(() => {
        if (firLoading || firError || fssLoading || fssError || !geoJsonData) {
            if (firLoading || !geoJsonData || fssLoading) {
                setGeoJsonFeatures({
                    type: "FeatureCollection",
                    features: []
                });
                return;
            }
        }

        let matchedFirs = {};

        // Match FIRs based on controller info
        if (controllerInfo && controllerInfo.fir && firData) {
            matchedFirs = controllerInfo.fir.reduce((acc, controller) => {
                const parts = controller.callsign.split("_")
                    .filter(part => part !== "CTR");
                let matchFound = false;

                while (parts.length > 0 && !matchFound) {
                    const potentialMatch = parts.join("_");
                    if (firData[potentialMatch]) {
                        if (!acc[potentialMatch]) {
                            acc[potentialMatch] = {
                                firKey: potentialMatch,
                                controllers: [],
                                firInfo: firData[potentialMatch],
                                isInFss: false
                            };
                        }
                        acc[potentialMatch].controllers.push({
                            name: controller.name,
                            frequency: controller.frequency,
                            logon_time: controller.logon_time,
                            callsign: controller.callsign
                        });
                        matchFound = true;
                    }
                    parts.pop();
                }
                return acc;
            }, {});
        }

        // Check FSS data if available
        if (controllerInfo && controllerInfo.fss && fssData) {
            controllerInfo.fss.forEach(fss => {
                const fssKey = fss.callsign.replace("_FSS", "");
                if (fssData[fssKey] && fssData[fssKey].firs) {
                    fssData[fssKey].firs.forEach(firKey => {
                        if (!matchedFirs[firKey]) {
                            const firInfo = firData[firKey];
                            if (firInfo) {
                                matchedFirs[firKey] = {
                                    firKey: firKey,
                                    controllers: [{
                                        name: fss.name,
                                        frequency: fss.frequency,
                                        logon_time: fss.logon_time,
                                        callsign: fss.callsign
                                    }],
                                    firInfo: firInfo,
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
                }
            });
        }

        const newFeatures = geoJsonData?.features.reduce((features, feature) => {
            const firKey = Object.keys(matchedFirs)
                .find(key =>
                    matchedFirs[key].firInfo.fir === feature.properties.id ||
                            matchedFirs[key].firInfo.icao === feature.properties.id
                );

            if (firKey && !features.some(f => f.key === `${feature.properties.id}-${firKey}`)) {
                features.push({
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
            return features;
        }, []);

        console.log("New features:", newFeatures);

        setGeoJsonFeatures({
            type: "FeatureCollection",
            features: newFeatures
        });
    }, [controllerInfo, firData, fssData, geoJsonData, isError, isLoading]);

    return {
        firData,
        geoJsonFeatures,
        isLoading,
        isError
    };
};

export default useMatchedFirFeatures;
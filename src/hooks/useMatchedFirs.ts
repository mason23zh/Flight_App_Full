import GeoJson from "geojson";
import { useMemo, useState } from "react";
import { VatsimControllers, VatsimFirs } from "../types";
import { useFetchVatsimFirQuery, useFetchVatsimFssQuery } from "../store";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";


export interface MatchedFir {
    id: string;
    controllers: {
        name: string;
        frequency: string;
        logon_time: string;
        callsign: string;
    }[];
    firInfo: {
        icao: string;
        fir: string;
        isFss: boolean;
        name: string;
    };
    label_lat: number;
    label_lon: number;
    oceanic: boolean;
    isInFss: boolean;
}

interface UseMatchedFirFeaturesReturn {
    matchedFirs: MatchedFir[];
    isLoading: boolean;
    isError: FetchBaseQueryError | SerializedError;
}


const useMatchedFirs = (
    controllerInfo: VatsimControllers,
    geoJsonData: GeoJson.FeatureCollection
): UseMatchedFirFeaturesReturn => {
    const [matchedFirs, setMatchedFirs] = useState<MatchedFir[]>([]);

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
        if (firLoading || firError || fssLoading || fssError || !geoJsonData || !controllerInfo) {
            setMatchedFirs([]);
            return;
        }

        let matchedFirsMap = {};

        // Handle FIR controllers
        if (controllerInfo.fir) {
            matchedFirsMap = controllerInfo.fir.reduce((acc, controller) => {
                const firKey = controller.firInfo.icao;
                const firInfoWithFlag = {
                    ...controller.firInfo,
                    isFss: false
                };
                if (!acc[firKey]) {
                    acc[firKey] = {
                        id: firKey,
                        controllers: [],
                        firInfo: firInfoWithFlag,
                        isInFss: false,
                        label_lat: null,
                        label_lon: null,
                        oceanic: false
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

        // Handle FSS controllers
        if (controllerInfo.fss && fssData) {
            controllerInfo.fss.forEach(fss => {
                const fssKey = fss.callsign.replace("_FSS", "");
                if (fssData[fssKey] && fssData[fssKey].firs) {
                    fssData[fssKey].firs.forEach(firKey => {
                        if (!matchedFirsMap[firKey]) {
                            const firInfo = firData[firKey];
                            if (firInfo) {
                                const firInfoWithFlag = {
                                    ...firInfo,
                                    isFss: true,
                                };
                                matchedFirsMap[firKey] = {
                                    id: firKey,
                                    controllers: [{
                                        name: fss.name,
                                        frequency: fss.frequency,
                                        logon_time: fss.logon_time,
                                        callsign: fss.callsign
                                    }],
                                    firInfo: firInfoWithFlag,
                                    isInFss: true,
                                    label_lat: null,
                                    label_lon: null,
                                    oceanic: false
                                };
                            }
                        } else {
                            matchedFirsMap[firKey].isInFss = true;
                            matchedFirsMap[firKey].controllers.push({
                                name: fss.name,
                                frequency: fss.frequency,
                                logon_time: fss.logon_time,
                                callsign: fss.callsign
                            });
                        }
                    });
                } else {
                    // Handle extended range FIRs (split by "_")
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
                            if (!matchedFirsMap[potentialMatchFirCode]) {
                                matchedFirsMap[potentialMatchFirCode] = {
                                    id: potentialMatchFirCode,
                                    controllers: [],
                                    firInfo: firInfoWithFlag,
                                    isInFss: false,
                                    label_lat: null,
                                    label_lon: null,
                                    oceanic: false
                                };
                            }
                            matchedFirsMap[potentialMatchFirCode].controllers.push({
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

        // Create the final list of matched FIRs
        const matchedFirsArray = [];

        geoJsonData.features.forEach(feature => {
            const firKey = Object.keys(matchedFirsMap)
                .find(key => {
                    const matchedFir = matchedFirsMap[key];
                    return matchedFir.firInfo.fir === feature.properties.id ||
                                matchedFir.firInfo.icao === feature.properties.id;
                });

            if (firKey) {
                const matchedFir = matchedFirsMap[firKey];
                const isOceanicFeature = feature.properties.oceanic === "1";

                // Avoid adding duplicates by checking oceanic status
                const existingFir = matchedFirsArray.find(fir => fir.id === feature.properties.id);

                if (!existingFir || (isOceanicFeature && !existingFir.oceanic)) {
                    matchedFirsArray.push({
                        ...matchedFir,
                        label_lat: feature.properties.label_lat,
                        label_lon: feature.properties.label_lon,
                        oceanic: isOceanicFeature
                    });
                }
            }
        });

        setMatchedFirs(matchedFirsArray);
    }, [controllerInfo, geoJsonData, firData, fssData, firLoading, firError, fssLoading, fssError]);

    return {
        matchedFirs,
        isLoading,
        isError
    };
};

export default useMatchedFirs;
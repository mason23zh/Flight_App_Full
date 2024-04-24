// This hook will fetch geoJson for fir boundaries and fir data
// after processing the data it will return formatted GeoJson Feature Collection
// firData, and either loading state or error state.
// The complexity of this hook is high, might be improved in the future.
import { useMemo, useState } from "react";
import { VatsimControllers, VatsimFirs } from "../types";
import GeoJson from "geojson";
import { useFetchVatsimFirBoundariesQuery, useFetchVatsimFirQuery } from "../store";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

interface UseMatchedFirFeaturesReturn {
    geoJsonFeatures: GeoJson.FeatureCollection,
    firData: VatsimFirs,
    isLoading: boolean,
    error: FetchBaseQueryError | SerializedError
}

const useMatchedFirFeatures = (
    controllerInfo: VatsimControllers,
): UseMatchedFirFeaturesReturn => {

    const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJson.FeatureCollection>({
        type: "FeatureCollection",
        features: []
    });

    const {
        data: geoJsonData,
        error: geoJsonError,
        isLoading: geoJsonLoading
    } = useFetchVatsimFirBoundariesQuery();
    const {
        data: firData,
        error: firError,
        isLoading: firLoading
    } = useFetchVatsimFirQuery();

    useMemo(() => {
        if (firLoading || geoJsonLoading || firError || geoJsonError) {
            setGeoJsonFeatures({
                type: "FeatureCollection",
                features: []
            });
            return;
        }

        if (firData && controllerInfo && controllerInfo.fir) {
            // Only select En route ATC
            const matchedFirs = controllerInfo.fir.reduce((acc, controller) => {
                const parts = controller.callsign.split("_")
                    .filter(part => part !== "CTR");
                let matchFound = false;

                while (parts.length > 0 && !matchFound) {
                    const potentialMatch = parts.join("_");
                    if (firData[potentialMatch]) {
                        if (!acc[potentialMatch]) { // construct new Fir
                            acc[potentialMatch] = {
                                firKey: potentialMatch,
                                controllers: [],
                                firInfo: firData[potentialMatch]
                            };
                        }
                        acc[potentialMatch].controllers.push({ // update Fir
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


            const newFeatures = geoJsonData.features.reduce((features, feature) => {
                const firKey = Object.keys(matchedFirs)
                    .find(key => matchedFirs[key].firInfo.fir === feature.properties.id);
                if (firKey) {
                    const uniqueFeatureKey = `${feature.properties.id}-${firKey}`;
                    if (!features.some(f => f.key === uniqueFeatureKey)) { // Check for unique key
                        features.push({
                            ...feature,
                            key: uniqueFeatureKey,  // Assign a unique key to each feature
                            properties: {
                                ...feature.properties,
                                controllers: matchedFirs[firKey].controllers,
                                firInfo: matchedFirs[firKey].firInfo
                            }
                        });
                    }
                }
                return features;
            }, []);

            setGeoJsonFeatures({
                type: "FeatureCollection",
                features: newFeatures
            });
        }
    }, [controllerInfo, firData, geoJsonData, firError, geoJsonError, firLoading, geoJsonLoading]);

    return {
        geoJsonFeatures,
        firData,
        isLoading: firLoading || geoJsonLoading,
        error: firError || geoJsonError
    };
};

export default useMatchedFirFeatures;
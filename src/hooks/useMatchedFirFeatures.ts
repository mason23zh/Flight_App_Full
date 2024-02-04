// This hook will fetch geoJson for fir boundaries and fir data
// after processing the data it will return formatted GeoJson Feature Collection
// firData, and either loading state or error state.
// The complexity of this hook is high, might be improved in the future.
import { useMemo, useState } from "react";
import { VatsimControllers, VatsimFirs } from "../types";
import GeoJson from "geojson";
import { useFetchVatsimFirBoundariesQuery, useFetchVatsimFirQuery } from "../store";

interface UseMatchedFirFeaturesReturn {
    geoJsonFeatures: GeoJson.FeatureCollection,
    firData: VatsimFirs,
    isLoading: boolean,
    error: Error
}

const useMatchedFirFeatures = (
    controllerInfo: VatsimControllers,
): UseMatchedFirFeaturesReturn => {


    const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJson.FeatureCollection>({
        "type": "FeatureCollection",
        "features": []
    });

    const {
        data: geoJsonData,
        error: geoJsonError,
        isLoading: geoJsonLoading
    } = useFetchVatsimFirBoundariesQuery({});

    const {
        data: firData,
        error: firError,
        isLoading: firLoading
    } = useFetchVatsimFirQuery({});


    useMemo(() => {
        if (firLoading || geoJsonLoading) {
            // early return, the empty features list will be checked in useRenderFirLabelMarker hook
            setGeoJsonFeatures({
                "type": "FeatureCollection",
                "features": []
            });
            return;
        } else if (firError || geoJsonError) {
            setGeoJsonFeatures({
                "type": "FeatureCollection",
                "features": []
            });
            return;
        } else if (firData && controllerInfo && controllerInfo.fir) {
            const matchedFirs = [];
            controllerInfo.fir.forEach(controller => {
                const parts = controller.callsign.split("_");
                if (parts[parts.length - 1] === "CTR") {
                    parts.pop();
                }
                let matchFound = false;
                while (parts.length > 0 && !matchFound) {
                    const potentialMatch = parts.join("_");
                    if (firData[potentialMatch]) {
                        console.log("Matched Fir features fir data:", firData[potentialMatch]);
                        matchedFirs.push({
                            firKey: potentialMatch,
                            controller,
                            firInfo: firData[potentialMatch]
                        });
                        matchFound = true;
                    }
                    parts.pop();
                }
            });

            // Handle the edge case where CZEG controller been displayed as FSS
            controllerInfo.fss.forEach((controller) => {
                if (controller.callsign === "CZEG_FSS") {
                    matchedFirs.push({
                        firKey: "CZEG",
                        controller,
                        firInfo: firData["CZEG"]
                    });
                }
            });

            if (matchedFirs.length > 0) {
                const newFeatures = [...geoJsonFeatures.features];

                matchedFirs.forEach(mFir => {
                    const geoJsonFeature = geoJsonData
                        .features
                        .find(feature => feature.properties.id === firData[mFir.firKey].fir);
                    if (geoJsonFeature) {
                        const isDuplicate = newFeatures
                            .some(existingFeature => existingFeature.properties.id === geoJsonFeature.properties.id);
                        if (!isDuplicate) {
                            // Clone the feature and add extra properties
                            const updatedFeature = {
                                ...geoJsonFeature,
                                properties: {
                                    ...geoJsonFeature.properties,
                                    ...mFir.controller, // Add additional properties from controller
                                    firInfo: firData[mFir.firKey]
                                }
                            };
                            newFeatures.push(updatedFeature);
                        }
                    }
                });

                setGeoJsonFeatures({
                    ...geoJsonFeatures,
                    features: newFeatures
                });
            }
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
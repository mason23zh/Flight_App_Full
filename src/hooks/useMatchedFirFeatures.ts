import { useMemo, useState } from "react";
import { VatsimControllers, VatsimFirs } from "../types";
import GeoJson from "geojson";

const useMatchedFirFeatures = (
    controllerInfo: VatsimControllers,
    firData: VatsimFirs,
    geoJsonData: GeoJson.FeatureCollection): GeoJson.FeatureCollection => {
    const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJson.FeatureCollection>({
        "type": "FeatureCollection",
        "features": []
    });

    useMemo(() => {
        if (firData && controllerInfo) {
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
    }, [controllerInfo, firData, geoJsonData]);

    return geoJsonFeatures;
};

export default useMatchedFirFeatures;
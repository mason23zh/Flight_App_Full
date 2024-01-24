import { useEffect, useMemo, useState } from "react";
import { VatsimControllers, VatsimFirBoundaries, VatsimFirs, VatsimMatchedFirBoundariesGeoJson } from "../types";
import GeoJson from "geojson";

const useMatchedFirFeatures = (controllerInfo: VatsimControllers, firData: VatsimFirs, geoJsonData: GeoJson.FeatureCollection): GeoJson.FeatureCollection => {
    const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJson.FeatureCollection>({
        "type": "FeatureCollection",
        "features": []
    });


    useMemo(() => {
        if (firData && controllerInfo) {
            const matchedFirs = [];
            controllerInfo.fir.forEach(controller => {
                const parts = controller.callsign.split("_"); // split controller's callsign by "_"
                if (parts[parts.length - 1] === "CTR") {  //If the end of callsign contains "CTR", remove "CTR"
                    parts.pop();
                }
                let matchFound = false; //set default match state
                while (parts.length > 0 && !matchFound) {
                    const potentialMatch = parts.join("_");
                    if (firData[potentialMatch]) {
                        // match found
                        console.log("Matched controller:", controller.callsign);
                        console.log("Matched GeoJson Features:", firData[potentialMatch].fir);
                        matchedFirs.push(firData[potentialMatch]);
                        matchFound = true;
                    }

                    parts.pop(); // remove the last element in the callsign if no match
                }
            });

            if (matchedFirs.length > 0) {
                const newFeatures = [...geoJsonFeatures.features]; // Clone the existing features array

                matchedFirs.forEach(mFir => {
                    const geoJsonFeature: GeoJson.Feature = geoJsonData.features.find(feature => feature.properties.id === mFir.fir);
                    if (geoJsonFeature) {
                        const isDuplicate = newFeatures.some(existingFeature => existingFeature.properties.id === geoJsonFeature.properties.id);
                        if (!isDuplicate) { // Check for duplicates
                            newFeatures.push(geoJsonFeature);
                        }
                    }
                });

                setGeoJsonFeatures(prevState => ({
                    ...prevState,
                    features: newFeatures
                }));
            }
        }
    }, [controllerInfo, firData, geoJsonData]);

    return geoJsonFeatures;
};

export default useMatchedFirFeatures;
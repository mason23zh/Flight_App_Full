import { VatsimControllers } from "../types";
import GeoJson from "geojson";
import { useEffect, useMemo, useState } from "react";

const useMatchTraconFeatures = (controllerInfo: VatsimControllers, geoJsonData: GeoJson.FeatureCollection): GeoJson.FeatureCollection => {
    const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJson.FeatureCollection>({
        "type": "FeatureCollection",
        "features": []
    });
    useMemo(() => {
        if (controllerInfo && geoJsonData) {
            const matchedTracons = new Set<GeoJson.Feature>();
            controllerInfo.other.controllers.forEach((controller) => {
                // facility 5 is APP/DEP
                if (controller.facility === 5) {
                    const parts = controller.callsign.split("_");
                    // since tracon callsign could be ended with APP or DEP, check both and remove
                    if (parts[parts.length - 1] === "APP" || parts[parts.length - 1] === "DEP") {
                        parts.pop();
                    }
                    let matchFound = false;
                    while (parts.length > 0 && !matchFound) {
                        const potentialMatch = parts.join("_");
                        // geoJsonData.features.forEach((feature) => {
                        //     console.log("tracon layer geojson feature::", feature.properties?.prefix[0]);
                        // });

                        const matchedFeature: GeoJson.Feature =
                                geoJsonData.features.find((feature) => feature.properties?.prefix[0] === potentialMatch);
                        // console.log("Matched Features:", matchedFeature);
                        if (matchedFeature) {
                            matchedTracons.add(matchedFeature);
                            matchFound = true;
                        }

                        parts.pop();
                    }
                }
            });
            const matchedArray: Array<GeoJson.Feature> = Array.from(matchedTracons);

            // const newFeatures = [...geoJsonFeatures.features];
            setGeoJsonFeatures(prevState => ({
                ...prevState,
                features: [...prevState.features, ...matchedArray]
            }));
        }
    }, [controllerInfo, geoJsonData]);

    return geoJsonFeatures;
};

export default useMatchTraconFeatures;
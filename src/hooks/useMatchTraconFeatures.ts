import { VatsimControllers } from "../types";
import GeoJson from "geojson";
import { useEffect, useState } from "react";
import { useFetchVatsimTraconBoundariesQuery } from "../store";

interface UseMatchTraconFeaturesReturn {
    geoJsonFeatures: GeoJson.FeatureCollection,
    isLoading: boolean,
    error: any
}

const useMatchTraconFeatures = (
    controllerInfo: VatsimControllers): UseMatchTraconFeaturesReturn => {
    console.log("controller info:", controllerInfo.other.controllers);

    const {
        data: geoJsonData,
        isLoading,
        error
    } = useFetchVatsimTraconBoundariesQuery();

    const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJson.FeatureCollection>({
        type: "FeatureCollection",
        features: []
    });

    useEffect(() => {
        if (isLoading || error) {
            setGeoJsonFeatures({
                type: "FeatureCollection",
                features: []
            });
            return;
        }

        if (controllerInfo?.other?.controllers && geoJsonData) {
            const featuresMap = new Map();

            controllerInfo.other.controllers.forEach(controller => {
                if (controller.facility === 5) {
                    const parts = controller.callsign.split("_");
                    if (parts[parts.length - 1] === "APP" || parts[parts.length - 1] === "DEP") {
                        parts.pop();  // Remove the last part if it is "APP" or "DEP"
                    }

                    while (parts.length > 0) {
                        const potentialMatch = parts.join("_");
                        //const matchedFeature = geoJsonData.features.find(feature => feature.properties?.prefix && feature.properties.prefix.includes(potentialMatch));
                        const matchedFeature = geoJsonData.features
                            .find(feature => feature.properties?.prefix[0] === potentialMatch);

                        if (matchedFeature) {
                            if (!featuresMap.has(matchedFeature.properties.id)) {
                                featuresMap.set(matchedFeature.properties.id, {
                                    ...matchedFeature,
                                    properties: {
                                        ...matchedFeature.properties,
                                        controllers: []
                                    }
                                });
                            }

                            const existingFeature = featuresMap.get(matchedFeature.properties.id);
                            existingFeature.properties.controllers.push({
                                name: controller.name,
                                frequency: controller.frequency,
                                logon_time: controller.logon_time,
                                callsign: controller.callsign
                            });

                            break;
                        }
                        parts.pop();
                    }
                }
            });

            setGeoJsonFeatures({
                type: "FeatureCollection",
                features: Array.from(featuresMap.values())  // Convert the map values to an array
            });
        }
    }, [controllerInfo, geoJsonData, isLoading, error]);

    return {
        geoJsonFeatures,
        isLoading,
        error
    };
};

export default useMatchTraconFeatures;
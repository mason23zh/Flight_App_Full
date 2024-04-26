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
    // console.log("controller info:", controllerInfo.other.controllers);
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
                        geoJsonData.features.forEach(feature => {
                            if (feature.properties?.prefix && feature.properties.prefix.includes(potentialMatch)) {
                                // compose a key, because some tracon has the same id but with different prefix
                                const key = `${feature.properties.id}-${potentialMatch}`;
                                if (!featuresMap.has(key)) {
                                    featuresMap.set(key, {
                                        ...feature,
                                        properties: {
                                            ...feature.properties,
                                            controllers: []
                                        }
                                    });
                                }

                                const existingFeature = featuresMap.get(key);
                                existingFeature.properties.controllers.push({
                                    name: controller.name,
                                    frequency: controller.frequency,
                                    logon_time: controller.logon_time,
                                    callsign: controller.callsign
                                });
                            }
                        });
                        parts.pop();
                    }
                }
            });

            setGeoJsonFeatures({
                type: "FeatureCollection",
                features: Array.from(featuresMap.values())
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
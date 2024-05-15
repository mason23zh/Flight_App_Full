import { VatsimControllers } from "../types";
import GeoJson from "geojson";
import { useEffect, useState } from "react";
import { useFetchVatsimTraconBoundariesQuery } from "../store";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { extractTraconName } from "../component/2d/mapbox_Layer/util/extractTraconName";
import { createMultiPolygonCircle } from "../component/2d/mapbox_Layer/util/createMultiPolygonCircle";

interface UseMatchTraconFeaturesReturn {
    geoJsonFeatures: GeoJson.FeatureCollection,
    isLoading: boolean,
    error: FetchBaseQueryError | SerializedError
}

const useMatchTraconFeatures = (
    controllerInfo: VatsimControllers): UseMatchTraconFeaturesReturn => {
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
                    const isApproachOrDeparture = parts[parts.length - 1] === "APP" || parts[parts.length - 1] === "DEP";
                    if (isApproachOrDeparture) parts.pop(); // Remove "APP" or "DEP"

                    let matched = false;

                    while (parts.length > 0 && !matched) {
                        const potentialMatch = parts.join("_");
                        geoJsonData.features.forEach(feature => {
                            if (feature.properties?.prefix && feature.properties.prefix.includes(potentialMatch)) {
                                matched = true;
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

                    // If no match found, create a circle with the given visual_range
                    if (!matched && controller.visual_range) {
                        const center = [Number(controller.coordinates[0]), Number(controller.coordinates[1])];

                        // divided by 5 seems to make the circle to the similar size as others, no idea why
                        const radius = controller.visual_range * 1.852 / 5;
                        const options = {
                            steps: 40,
                            units: "kilometers"
                        };
                        const multiPolygonCircle = createMultiPolygonCircle(center, radius, options, controller);
                        const key = `circle-${controller.callsign}`;
                        const name = extractTraconName(controller);

                        featuresMap.set(key, {
                            ...multiPolygonCircle,
                            properties: {
                                ...multiPolygonCircle.properties,
                                id: controller.callsign.split("_")[0],
                                name: name,
                                controllers: [{
                                    callsign: controller.callsign,
                                    frequency: controller.frequency,
                                    logon_time: controller.logon_time,
                                    name: controller.name
                                }]

                            }
                        });
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
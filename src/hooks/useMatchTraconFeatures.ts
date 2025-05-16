import { VatsimControllers } from "../types";
import GeoJson from "geojson";
import { useEffect, useState } from "react";
import { useFetchVatsimTraconBoundariesQuery } from "../store";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { extractTraconName } from "../component/map/mapbox_Layer/util/extractTraconName";
import { createMultiPolygonCircle } from "../component/map/mapbox_Layer/util/createMultiPolygonCircle";
import _ from "lodash";

interface UseMatchTraconFeaturesReturn {
    geoJsonFeatures: GeoJson.FeatureCollection;
    isLoading: boolean;
    error: FetchBaseQueryError | SerializedError;
}

const useMatchTraconFeatures = (
    controllerInfo: VatsimControllers
): UseMatchTraconFeaturesReturn => {
    const { data: geoJsonData, isLoading, error } = useFetchVatsimTraconBoundariesQuery();

    const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJson.FeatureCollection>({
        type: "FeatureCollection",
        features: [],
    });

    useEffect(() => {
        if (isLoading || error) {
            setGeoJsonFeatures({
                type: "FeatureCollection",
                features: [],
            });
            return;
        }

        if (controllerInfo?.tracon && geoJsonData) {
            const featuresMap = new Map();

            controllerInfo.tracon.forEach((controller) => {
                const originalParts = controller.callsign.split("_");
                const isApproachOrDeparture =
                    originalParts[originalParts.length - 1] === "APP" ||
                    originalParts[originalParts.length - 1] === "DEP";
                if (isApproachOrDeparture) originalParts.pop(); // Remove "APP" or "DEP"

                let matched = false;

                let parts = [...originalParts];
                while (parts.length > 0 && !matched) {
                    const potentialMatch = parts.join("_");
                    geoJsonData.features.forEach((feature) => {
                        if (
                            Array.isArray(feature.properties?.prefix) &&
                            feature.properties.prefix.includes(potentialMatch)
                        ) {
                            matched = true;
                            const key = `${feature.properties.id}-${potentialMatch}`;
                            if (!featuresMap.has(key)) {
                                featuresMap.set(key, {
                                    ...feature,
                                    properties: {
                                        ...feature.properties,
                                        controllers: [],
                                    },
                                });
                            }
                            const existingFeature = featuresMap.get(key);
                            if (
                                existingFeature &&
                                !existingFeature.properties.controllers.some(
                                    (ctrl) => ctrl.callsign === controller.callsign
                                )
                            ) {
                                existingFeature.properties.controllers.push({
                                    name: controller.name,
                                    frequency: controller.frequency,
                                    logon_time: controller.logon_time,
                                    callsign: controller.callsign,
                                });
                            }
                        }
                    });
                    parts.pop();
                }

                // Handle some edge case such like: URSS_1_R_APP
                if (!matched) {
                    parts = controller.callsign
                        .split("_")
                        .filter((part) => part !== "APP" && part !== "DEP" && part !== "1");
                    while (parts.length > 0 && !matched) {
                        const potentialMatch = parts.join("_");
                        geoJsonData.features.forEach((feature) => {
                            if (
                                Array.isArray(feature.properties?.prefix) &&
                                feature.properties.prefix.includes(potentialMatch)
                            ) {
                                matched = true;
                                const key = `${feature.properties.id}-${potentialMatch}`;
                                if (!featuresMap.has(key)) {
                                    featuresMap.set(key, {
                                        ...feature,
                                        properties: {
                                            ...feature.properties,
                                            controllers: [],
                                        },
                                    });
                                }
                                const existingFeature = featuresMap.get(key);
                                if (
                                    existingFeature &&
                                    !existingFeature.properties.controllers.some(
                                        (ctrl) => ctrl.callsign === controller.callsign
                                    )
                                ) {
                                    existingFeature.properties.controllers.push({
                                        name: controller.name,
                                        frequency: controller.frequency,
                                        logon_time: controller.logon_time,
                                        callsign: controller.callsign,
                                    });
                                }
                            }
                        });
                        parts.pop();
                    }
                }

                // If no match found, create a circle with the given visual_range
                if (
                    !matched &&
                    controller.visual_range &&
                    !_.isEmpty(controller.airport) &&
                    controller.coordinates.length !== 0
                ) {
                    const center = [
                        Number(controller.coordinates[0]),
                        Number(controller.coordinates[1]),
                    ];
                    const radius = (controller.visual_range * 1.852) / 5;
                    const options = {
                        steps: 40,
                        units: "kilometers",
                    };
                    const multiPolygonCircle = createMultiPolygonCircle(
                        center,
                        radius,
                        options,
                        controller
                    );
                    const key = `circle-${controller.callsign.split("_")[0]}`;
                    const name = extractTraconName(controller);

                    // If more than one controller working on the same tracon, add them
                    if (featuresMap.has(key)) {
                        const existingFeature = featuresMap.get(key);
                        if (
                            existingFeature &&
                            !existingFeature.properties.controllers.some(
                                (ctrl) => ctrl.callsign === controller.callsign
                            )
                        ) {
                            existingFeature.properties.controllers.push({
                                callsign: controller.callsign,
                                frequency: controller.frequency,
                                logon_time: controller.logon_time,
                                name: controller.name,
                            });
                        }
                    } else {
                        featuresMap.set(key, {
                            ...multiPolygonCircle,
                            properties: {
                                ...multiPolygonCircle.properties,
                                id: controller.callsign.split("_")[0],
                                name: name,
                                controllers: [
                                    {
                                        callsign: controller.callsign,
                                        frequency: controller.frequency,
                                        logon_time: controller.logon_time,
                                        name: controller.name,
                                    },
                                ],
                            },
                        });
                    }
                }
            });

            setGeoJsonFeatures({
                type: "FeatureCollection",
                features: Array.from(featuresMap.values()),
            });
        }
    }, [controllerInfo, geoJsonData, isLoading, error]);

    return {
        geoJsonFeatures,
        isLoading,
        error,
    };
};

export default useMatchTraconFeatures;

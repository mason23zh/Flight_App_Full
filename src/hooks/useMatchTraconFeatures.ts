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

    // const {
    //     data: geoJsonData,
    //     isLoading,
    //     error
    // } = useFetchVatsimTraconBoundariesQuery();
    //
    // const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJson.FeatureCollection>({
    //     type: "FeatureCollection",
    //     features: []
    // });
    //
    // console.log("match tracon controller info:", controllerInfo);
    //
    // useEffect(() => {
    //     if (isLoading || error) {
    //         setGeoJsonFeatures({
    //             type: "FeatureCollection",
    //             features: []
    //         });
    //         return;
    //     }
    //
    //     if (controllerInfo?.other?.controllers && geoJsonData) {
    //         const traconMatches = geoJsonData.features.reduce((acc, feature) => {
    //             controllerInfo.other.controllers.forEach(controller => {
    //                 if (controller.facility === 5) {  // Assuming facility code 5 means TRACON
    //                     const parts = controller.callsign.split("_")
    //                         .filter(part => part === "APP" || part === "DEP");
    //                     const potentialMatch = parts.join("_");
    //                     if (feature.properties?.prefix[0] === potentialMatch) {
    //                         if (!acc[feature.properties.id]) {
    //                             acc[feature.properties.id] = {
    //                                 ...feature,
    //                                 properties: {
    //                                     ...feature.properties,
    //                                     controllers: []
    //                                 }
    //                             };
    //                         }
    //                         acc[feature.properties.id].properties.controllers.push(controller);
    //                     }
    //                 }
    //             });
    //             return acc;
    //         }, {});
    //
    //         const newFeatures = Object.values(traconMatches);
    //         console.log("Features match tracon:", newFeatures);
    //
    //         setGeoJsonFeatures({
    //             type: "FeatureCollection",
    //             features: newFeatures
    //         });
    //     }
    // }, [controllerInfo, geoJsonData, isLoading, error]);
    //
    // return {
    //     geoJsonFeatures,
    //     isLoading,
    //     error
    // };


    const {
        data: geoJsonData,
        isLoading,
        error
    } = useFetchVatsimTraconBoundariesQuery();


    const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJson.FeatureCollection>({
        "type": "FeatureCollection",
        "features": []
    });


    useEffect(() => {
        if (isLoading) {
            setGeoJsonFeatures({
                "type": "FeatureCollection",
                "features": []
            });
            return;
        }

        if (error) {
            setGeoJsonFeatures({
                "type": "FeatureCollection",
                "features": []
            });
            return;
        }

        if (controllerInfo && controllerInfo?.other?.controllers && geoJsonData) {
            const newFeaturesSet = new Set<string>(); // Store ids of new features
            const newFeatures = []; // Array to store new GeoJson features

            controllerInfo.other.controllers.forEach(controller => {
                if (controller.facility === 5) {
                    const parts = controller.callsign.split("_");
                    if (parts[parts.length - 1] === "APP" || parts[parts.length - 1] === "DEP") {
                        parts.pop();
                    }
                    let matchFound = false;
                    while (parts.length > 0 && !matchFound) {
                        const potentialMatch = parts.join("_");
                        const matchedFeature = geoJsonData.features.find(feature => feature.properties?.prefix[0] === potentialMatch);
                        if (matchedFeature && !newFeaturesSet.has(matchedFeature.properties.id)) {
                            // append the controller info into the GeoJson Feature
                            const tempMatchedFeature = {
                                ...matchedFeature,
                                properties: {
                                    controllerInfo: controller,
                                    ...matchedFeature.properties
                                }
                            };
                            newFeaturesSet.add(matchedFeature.properties.id);
                            newFeatures.push(tempMatchedFeature);
                            matchFound = true;
                        }
                        parts.pop();
                    }
                }
            });

            // Only update state if new features are different from existing features
            if (newFeatures.length !== geoJsonFeatures.features.length || newFeatures.some((feature, idx) => feature !== geoJsonFeatures.features[idx])) {
                setGeoJsonFeatures({
                    "type": "FeatureCollection",
                    "features": newFeatures
                });
            }
        }
    }, [controllerInfo, geoJsonData, isLoading, error]);

    return {
        geoJsonFeatures: geoJsonFeatures,
        isLoading: isLoading,
        error: error
    };
};

export default useMatchTraconFeatures;
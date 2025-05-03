import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import {
    GLOBE_FIR_ICON_LAYER_ID,
    GLOBE_TRACON_ICON_LAYER_ID,
    GLOBE_CONTROLLER_ICON_LAYER_ID,
    GLOBE_TRAFFIC_ICON_LAYER_ID
} from "../component/map/globe_projection/layerSourceName";

const LAYER_PRIORITY_ORDER = [
    GLOBE_TRAFFIC_ICON_LAYER_ID,
    GLOBE_CONTROLLER_ICON_LAYER_ID,
    GLOBE_TRACON_ICON_LAYER_ID,
    GLOBE_FIR_ICON_LAYER_ID //FIR icon layer on top
];

export const useGlobeLayerOrdering = (map: mapboxgl.Map | null) => {
    useEffect(() => {
        if (!map) return;

        const reorderLayers = () => {
            const allExists = LAYER_PRIORITY_ORDER.every(id => map.getLayer(id));
            if (!allExists) {
                setTimeout(reorderLayers, 100);
                return;
            }

            LAYER_PRIORITY_ORDER.forEach(layerId => {
                if (map.getLayer(layerId)) {
                    map.moveLayer(layerId);
                }
            });

            console.log("Globe Layers reorder:", [...LAYER_PRIORITY_ORDER]);
        };

        reorderLayers();

        map.on("style.load", reorderLayers);
        return () => {
            map.off("style.load", reorderLayers);
        };
    }, [map]);
};
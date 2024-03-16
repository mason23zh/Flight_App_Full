import { MapRef } from "react-map-gl";
import React from "react";

const switchMapLabels = (mapRef: React.RefObject<MapRef>, visibility: boolean) => {
    const flag = visibility ? "visible" : "none";
    if (mapRef.current) {
        const map = mapRef.current.getMap();
        const layers = [
            "continent-label", "country-label", "state-label",
            "settlement-major-label", "settlement-minor-label",
            "settlement-subdivision-label"
        ];

        layers.forEach(layer => {
            try {
                map.setLayoutProperty(layer, "visibility", flag);
            } catch (e) {
                console.error(`Error setting visibility for ${layer}`, e);
            }
        });
    }
};

export default switchMapLabels;
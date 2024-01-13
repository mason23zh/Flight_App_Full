import { MapRef } from "react-map-gl";
import React from "react";

const switchMapLabels = (mapRef: React.RefObject<MapRef>, visibility: boolean) => {
    const flag = visibility ? "visible" : "none";
    if (mapRef.current) {
        console.log("switch map label's mapRef:", mapRef.current.getMap());
        const map = mapRef.current.getMap();
        console.log("map from ref", map);
        map.setLayoutProperty("continent-label", "visibility", flag);
        map.setLayoutProperty("country-label", "visibility", flag);
        map.setLayoutProperty("state-label", "visibility", flag);
        map.setLayoutProperty("settlement-major-label", "visibility", flag);
        map.setLayoutProperty("settlement-minor-label", "visibility", flag);
        map.setLayoutProperty("settlement-subdivision-label", "visibility", flag);
    }
};

export default switchMapLabels;
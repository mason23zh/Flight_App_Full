import { MapRef } from "react-map-gl";
import React from "react";


const switchControllerView = (mapRef: React.RefObject<MapRef>, visibility) => {
    const flag = visibility ? "visible" : "none";
    if (mapRef.current) {
        const map = mapRef.current.getMap();
        map.setLayoutProperty("firs", "visibility", flag);
        map.setLayoutProperty("fir-text", "visibility", flag);
        map.setLayoutProperty("tracons", "visibility", flag);
        map.setLayoutProperty("tracons-boundaries-line", "visibility", flag);
        map.setLayoutProperty("firs-boundary-line", "visibility", flag);
    }
};

export default switchControllerView;
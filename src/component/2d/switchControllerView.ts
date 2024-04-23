import { MapRef } from "react-map-gl";
import React from "react";


const switchControllerView = (mapRef: React.RefObject<MapRef>, visibility) => {
    const flag = visibility ? "visible" : "none";
    if (mapRef.current) {
        const map = mapRef.current.getMap();
        map.setLayoutProperty("fir-boundaries-layer", "visibility", flag);
        map.setLayoutProperty("fir-boundaries-line-layer", "visibility", flag);
        map.setLayoutProperty("tracon-boundaries-line-layer", "visibility", flag);
    }
};

export default switchControllerView;
import { MapRef } from "react-map-gl";
import React from "react";

const switchMapLabels = (mapRef: React.RefObject<MapRef>, visibility: boolean) => {
    const flag = visibility ? "visible" : "none";
    if (mapRef.current) {
        const map = mapRef.current.getMap();
        map.setLayoutProperty("satellite", "visibility", flag);
        map.setLayoutProperty("background", "visibility", flag);
        //map.setStyle("mapbox://styles/mason-zh/clsfcpiw5038w01qs0iigh5tn");
    }
};

export default switchMapLabels;
import React from "react";
import { MapRef } from "react-map-gl";

const switchMapRoads = (mapRef: React.RefObject<MapRef>, visibility: boolean) => {
    const flag = visibility ? "visible" : "none";
    if (mapRef.current) {
        const map = mapRef.current.getMap();
        map.setLayoutProperty("tunnel-major-link", "visibility", flag);
        map.setLayoutProperty("tunnel-street-case", "visibility", flag);
        map.setLayoutProperty("tunnel-primary", "visibility", flag);
        map.setLayoutProperty("tunnel-motorway-trunk", "visibility", flag);
        map.setLayoutProperty("bridge-minor-case", "visibility", flag);
        map.setLayoutProperty("bridge-street-case", "visibility", flag);
        map.setLayoutProperty("bridge-primary-case", "visibility", flag);
        map.setLayoutProperty("bridge-motorway-trunk-case", "visibility", flag);
        map.setLayoutProperty("bridge-major-link-case", "visibility", flag);
        map.setLayoutProperty("road-construction", "visibility", flag);
        map.setLayoutProperty("road-exit-shield", "visibility", flag);
        map.setLayoutProperty("road-intersection", "visibility", flag);
        map.setLayoutProperty("road-label", "visibility", flag);
        map.setLayoutProperty("road-major-link", "visibility", flag);
        map.setLayoutProperty("road-major-link-case", "visibility", flag);
        map.setLayoutProperty("road-minor", "visibility", flag);
        map.setLayoutProperty("road-minor-case", "visibility", flag);
        map.setLayoutProperty("road-minor-link", "visibility", flag);
        map.setLayoutProperty("road-minor-link-case", "visibility", flag);
        map.setLayoutProperty("road-motorway-trunk", "visibility", flag);
        map.setLayoutProperty("road-motorway-trunk-case", "visibility", flag);
        map.setLayoutProperty("road-primary", "visibility", flag);

    }
};

export default switchMapRoads;
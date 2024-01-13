import React, { useEffect } from "react";
import { MapRef } from "react-map-gl";

const calculateMarkerSize = (zoom) => {
    // Define your size calculation based on zoom level
    const scaleFactor = Math.pow(2, zoom - 10); // Example scale factor
    return Math.max(10, Math.min(30, scaleFactor * 20)); // Example size calculation
};
const changeMarkerSize = (mapRef: React.RefObject<MapRef>) => {
    console.log("change marks size run", mapRef.current);
    if (mapRef.current) {
        const map = mapRef.current.getMap();
        console.log("change makreder size:", map);
        const zoom = map.getZoom();
        console.log("Marker size zoom:", zoom);
        const scale = 1 + (map.getZoom() - 8) * 0.4;

        const markers = document.querySelectorAll(".mapboxgl-marker");
        console.log("Markers:", markers);
        markers.forEach((marker) => {
            console.log("Marker:", marker);

            //onst el = marker.getElement().children[0];
            marker.style.transform = `scale(${scale})`;
            marker.style.transformOrigin = "bottom";
        });


    }

};

export default changeMarkerSize;
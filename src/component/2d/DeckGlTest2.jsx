import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

// mapboxgl.accessToken = "pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA";
mapboxgl.accessToken = "pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA";


function DeckGlTest2() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
    
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mason-zh/clqq37e4c00k801p586732u2h",
            center: [lng, lat],
            zoom,
        });
        
        map.current.on("move", () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });
    
    
    return (
        <div>
            <div className="bg-amber-600 px-2 py-3 z-1 absolute top-0 left-0 m-[12px] rounded-md">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="h-[500px]" />
        </div>
    );
}

export default DeckGlTest2;

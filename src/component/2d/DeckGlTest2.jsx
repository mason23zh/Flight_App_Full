import React, { useRef, useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import mapboxgl from "mapbox-gl";
import { MapboxLayer, MapboxOverlay } from "@deck.gl/mapbox";
import {
    Map, useControl, useMap, Layer,
} from "react-map-gl";
import { LineLayer, ScatterplotLayer } from "@deck.gl/layers";

// mapboxgl.accessToken = "pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA";
mapboxgl.accessToken = "pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA";


function DeckGlTest2() {
    const data = [
        { sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781] },
    ];
    
    
    const layers = [
        new ScatterplotLayer({
            id: "my-scatterplot",
            data: [{ position: [-122.41669, 37.7853], size: 500 }],
            getPosition: (d) => d.position,
            getRadius: (d) => d.size,
            getColor: [255, 0, 0],
        }),
    ];
    
    
    const [viewState, setViewState] = React.useState({
        longitude: -122.41669,
        latitude: 37.7853,
        zoom: 14,
        pitch: 0,
        bearing: 0,
    });
    
    
    const onMove = React.useCallback(({ viewState }) => {
        const newCenter = [viewState.longitude, viewState.latitude];
        // map.setCenter(newCenter);
        setViewState({ longitude: viewState.longitude, latitude: viewState, ...viewState });
        // Only update the view state if the center is inside the geofence
    }, []);
    
    
    return (
        <DeckGL
            initialViewState={viewState}
            controller
            layers={layers}
            onViewStateChange={({ viewState }) => setViewState(viewState)}
        >
            <Map
                mapboxAccessToken="pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA"
                initialViewState={viewState}
                style={{ width: 600, height: 400 }}
                mapStyle="mapbox://styles/mason-zh/clqq37e4c00k801p586732u2h"
                onMove={onMove}
                projection="globe"
            >
                    
                <div className="bg-amber-600 px-2 py-3 z-1 absolute top-0 left-0 m-[12px] rounded-md">
                    Longitude: {viewState.longitude} | Latitude: {viewState.longitude} | Zoom: {viewState.zoom}
                </div>
            </Map>
        </DeckGL>
    );
}

export default DeckGlTest2;

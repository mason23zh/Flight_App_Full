import React, { useState } from "react";
import DeckGL from "@deck.gl/react";
import { LineLayer } from "@deck.gl/layers";

import Map, { Source, Layer } from "react-map-gl";

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = "your_mapbox_token";

// Viewport settings
const INITIAL_VIEW_STATE = {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 13,
    pitch: 0,
    bearing: 0,
};

// Data to be used by the LineLayer

function DeckGlTest4() {
    const [viewState, setViewState] = useState({
        longitude: -122.41669,
        latitude: 37.7853,
        zoom: 13,
        pitch: 0,
        bearing: 0,
    });
    
    const data = [
        { sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781] },
    ];
    const layers = [
        new LineLayer({ id: "line-layer", data }),
    ];
    
    return (
        <DeckGL
            initialViewState={viewState}
            controller
            layers={layers}
        >
            <Map
                mapboxAccessToken="pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA"
                initialViewState={viewState}
                style={{ width: 600, height: 400 }}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                // onMove={onMove}
                // projection="globe"
                terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
            >
                <Source
                    id="mapbox-dem"
                    type="raster-dem"
                    url="mapbox://mapbox.mapbox-terrain-dem-v1"
                    tileSize={512}
                    maxzoom={14}
                />
            </Map>
        </DeckGL>
    );
}

export default DeckGlTest4;

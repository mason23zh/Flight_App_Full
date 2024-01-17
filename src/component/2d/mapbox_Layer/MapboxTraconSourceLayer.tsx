import React from "react";
import { Source } from "react-map-gl";

const MapboxTraconSourceLayer = ({ children }) => {
    return (
        <Source
            id="tracon-source-layer"
            url={import.meta.env.VITE_MAPBOX_TRACON_LAYER_URL}
            type="vector"
            maxzoom={14}>
            {children}
        </Source>
    );
};

export default MapboxTraconSourceLayer;
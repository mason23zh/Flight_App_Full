import React from "react";
import { Source } from "react-map-gl";

const MapboxSourceLayer = ({ children }) => {
    return (
        <Source
            id="gns-430-source"
            url="mapbox://mason-zh.clqwtv3cf6uko1mmpi3uooj4y-6emjw"
            type="vector"
            maxzoom={14}>
            {children}
        </Source>
    );
};

export default MapboxSourceLayer;
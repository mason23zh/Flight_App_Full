import React from "react";
import { Source } from "react-map-gl";

const MapboxTextSourceLayer = ({ children }) => {
    return (
        <Source
            id="fir_labels"
            url="mapbox://mason-zh.2kqlmmyj"
            type="vector"
            maxzoom={20}>
            {children}
        </Source>
    );
};

export default MapboxTextSourceLayer;
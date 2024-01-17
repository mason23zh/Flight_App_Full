import React from "react";
import { Source } from "react-map-gl";

const FirBoundarySourceLayer = ({ children }) => {
    return (
        <Source
            id="fir-boundary-source"
            url="mapbox://mason-zh.clqudy2fp2ag61nogduw0ofwr-96of0"
            type="vector"
            maxzoom={14}>
            {children}
        </Source>
    );
};

export default FirBoundarySourceLayer;
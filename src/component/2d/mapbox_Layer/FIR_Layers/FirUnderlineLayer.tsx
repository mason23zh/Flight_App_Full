/*
* Render all Firs boundaries lines
*/
import React from "react";
import { Layer, Source } from "react-map-gl";
import { underlineBoundariesLineStyle } from "./firLayerMapStyle";


const FirUnderlineLayer = () => {
    return (
        <Source
            id="fir-outline-boundaries-source"
            type="vector"
            url="mapbox://mason-zh.cm00590z503li1tlkgyy8e5s3-5pv1b"
        >
            <Layer {...underlineBoundariesLineStyle}/>
        </Source>
    );
};

export default React.memo(FirUnderlineLayer);
/*
* Render all Firs boundaries lines
*/
import React from "react";
import { Layer, Source } from "react-map-gl";
import { underlineBoundariesLineStyle } from "./firLayerMapStyle";


// const tilesetId = "mason-zh.clqudy2fp2ag61nogduw0ofwr-96of0";
const FirUnderlineLayer = () => {
    return (
        <Source
            id="fir-outline-boundaries-source"
            type="vector"
            url="mapbox://mason-zh.clqudy2fp2ag61nogduw0ofwr-96of0"
        >
            <Layer {...underlineBoundariesLineStyle}/>
        </Source>
    );
};

export default React.memo(FirUnderlineLayer);
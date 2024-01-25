import { FillLayer, Layer, LineLayer } from "react-map-gl";
import React from "react";
// import { LineLayer } from "@deck.gl/layers/typed";


// <Layer
//         type="line"
// source="fir-boundary-source"
// source-layer="firboundaries"
// id="firs-boundary-line"
// filter={filter}
// paint={{
//     "line-color": "#FFFFFF",
//             "line-width": 1.5
// }}
// />

export const highlightLayer: FillLayer = {
    id: "fir-highlight-boundaries-layer",
    type: "fill",
    paint: {
        "fill-color": "#9499a8",
        "fill-opacity": 1,
    }
};

export const layerStyle: FillLayer = {
    id: "fir-boundaries-layer",
    type: "fill",
    paint: {
        "fill-color": "#9499a8",
        "fill-opacity": 0.5,
    }
};

export const boundariesLineStyle: LineLayer = {
    id: "fir-boundaries-line-layer",
    type: "line",
    paint: {
        "line-color": "#FFFFFF",
        "line-width": 1.8
    }
};


import { FillLayer, LineLayer } from "react-map-gl";


export const highlightTraconBoundariesLayerStyle: FillLayer = {
    id: "highlight-tracon-boundaries-layer",
    type: "fill",
    paint: {
        "fill-color": "#27aef5",
        "fill-opacity": 0.4,
    }
};

export const traconBoundariesLineLayerStyle: LineLayer = {
    id: "tracon-boundaries-line-layer",
    type: "line",
    paint: {
        "line-color": "#04BDFF",
        "line-width": 2
    }
};
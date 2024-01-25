import { FillLayer, LineLayer } from "react-map-gl";

export const traconBoundariesLayerStyle: FillLayer = {
    id: "tracon-boundaries-layer",
    type: "fill",
    paint: {
        "fill-color": "#27aef5",
        "fill-opacity": 0.5,
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
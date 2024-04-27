import { FillLayer, LineLayer } from "react-map-gl";

export const highlightLayer: FillLayer = {
    id: "fir-highlight-boundaries-layer",
    type: "fill",
    paint: {
        "fill-color": "#9499a8",
        "fill-opacity": 0.4,
    }
};

export const layerStyle: FillLayer = {
    id: "fir-boundaries-layer",
    type: "fill",
    paint: {
        "fill-color": "#9499a8",
        "fill-opacity": 0.2,
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

export const underlineBoundariesLineStyle: LineLayer = {
    id: "fir-underline-boundaries-line-layer",
    type: "line",
    paint: {
        "line-color": "#9499a8",
        "line-width": 0.5
    }
};


import { FillLayer, LineLayer } from "react-map-gl";

export const highlightLayer: FillLayer = {
    id: "fss-highlight-boundaries-layer",
    type: "fill",
    paint: {
        "fill-color": "#9499a8",
        "fill-opacity": 0.4,
    }
};

export const layerStyle: FillLayer = {
    id: "fss-boundaries-layer",
    type: "fill",
    paint: {
        "fill-color": "#9499a8",
        "fill-opacity": 0.2,
    }
};

export const boundariesLineStyle: LineLayer = {
    id: "fss-boundaries-line-layer",
    type: "line",
    paint: {
        "line-color": "#FFFFFF",
        "line-width": 1.8
    }
};
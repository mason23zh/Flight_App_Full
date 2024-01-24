import { FillLayer } from "react-map-gl";

export const traconBoundariesLayerStyle: FillLayer = {
    id: "test-tracon-layer",
    type: "fill",
    paint: {
        "fill-color": "#27aef5",
        "fill-opacity": 0.5,
    }
};
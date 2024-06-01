import { LineLayer } from "react-map-gl";

export const connectionPathStyle: LineLayer = {
    id: "airport-connection-path-line-layer",
    type: "line",
    paint: {
        // "line-color": "#FF0000",
        "line-color": "#27e3dd",
        "line-width": 2.0
    }
};
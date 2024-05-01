import { FillLayer, LineLayer } from "react-map-gl";

export const dayNightTerminatorStyle: FillLayer = {
    id: "day-night-terminator-layer",
    type: "fill",
    paint: {
        "fill-color": "#9499a8",
        "fill-opacity": 1.0
    }
};

// export const dayNightTerminatorStyle: LineLayer = {
//     id: "day-night-terminator-layer",
//     type: "line",
//     paint: {
//         "line-color": "#9499a8",
//         "line-width": 2
//     }
// };
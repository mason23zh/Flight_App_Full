import { FillLayer } from "react-map-gl";

export const dayNightTerminatorStyle: FillLayer = {
    id: "day-night-terminator-layer",
    type: "fill",
    paint: {
        "fill-color": "#818589",
        "fill-opacity": 0.3,
    },
};

// export const dayNightTerminatorStyle: LineLayer = {
//     id: "day-night-terminator-layer",
//     type: "line",
//     paint: {
//         "line-color": "#9499a8",
//         "line-width": 2
//     }
// };

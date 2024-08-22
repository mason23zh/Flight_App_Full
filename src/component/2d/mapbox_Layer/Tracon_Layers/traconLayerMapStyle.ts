import { FillLayer, LineLayer } from "react-map-gl";
import { MatchedTracon } from "../../../../hooks/useMatchTracon";


export const activeTraconLayerStyle = (matchedTracon: MatchedTracon[]): FillLayer => {
    const filterConditions = ["any", ...matchedTracon.map(tracon => ["==", ["get", "id"], tracon.traconInfo.id])];
    return {
        id: "tracon-boundaries-layer",
        type: "fill",
        source: "active-tracon-layers",
        "source-layer": "latest_tracon_boundaries",
        paint: {
            "fill-color": "#27aef5",
            "fill-opacity": 0.4,
        },
        filter: filterConditions
    };
};


export const highlightTraconBoundariesLayerStyle: FillLayer = {
    id: "highlight-tracon-boundaries-layer",
    type: "fill",
    paint: {
        "fill-color": "#27aef5",
        "fill-opacity": 0.4,
    }
};

// export const traconBoundariesLineLayerStyle: LineLayer = {
//     id: "tracon-boundaries-line-layer",
//     type: "line",
//     paint: {
//         "line-color": "#04BDFF",
//         "line-width": 2
//     }
// };

export const traconBoundariesLineLayerStyle: LineLayer = {
    id: "tracon-boundaries-line-layer",
    source: "active-tracon-layers",
    "source-layer": "latest_tracon_boundaries",
    type: "line",
    paint: {
        "line-color": "#04BDFF",
        "line-width": 2
    }
};


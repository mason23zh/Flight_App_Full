import { FillLayer, LineLayer } from "react-map-gl";
import { MatchedTracon } from "../../../../hooks/useMatchTracon";

//TODO: different style for active and in-active
export const activeTraconLineLayerStyle = (matchedTracon: MatchedTracon[]): LineLayer => {
    const filterConditions = ["any", ...matchedTracon.map(tracon => ["==", ["get", "id"], tracon.traconInfo.id])];
    return {
        id: "tracon-boundaries-layer",
        type: "line",
        source: "active-tracon-layers",
        "source-layer": "latest_tracon_boundaries",
        paint: {
            "line-color": "#04BDFF",
            "line-width": 2,
        },
        filter: filterConditions
    };
};

export const activeTraconFillLayerStyle = (hoverInfo: MatchedTracon | null): FillLayer => {
    // const filterConditions = ["any", ...matchedTracon.map(tracon => ["==", ["get", "id"], tracon.traconInfo.id])];
    const hoverTraconId = hoverInfo ? hoverInfo.traconInfo.id : null;
    return {
        id: "tracon-fill-layer",
        type: "fill",
        source: "active-tracon-layers",
        "source-layer": "latest_tracon_boundaries",
        paint: {
            "fill-color": "#27aef5",
            // "fill-opacity": 0.4
            "fill-opacity": [
                "case",
                ["==", ["get", "id"], hoverTraconId],
                0.4,
                0
            ]
        },
        filter: hoverTraconId ? ["==", ["get", "id"], hoverTraconId] : ["has", "id"]
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


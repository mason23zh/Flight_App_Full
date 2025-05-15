import { FillLayer, LineLayer } from "react-map-gl";
import { MatchedTracon } from "../../../../hooks/useMatchTracon";
import { HoverTracon } from "./TraconLabelPopup";

export const activeTraconLineLayerStyle = (matchedTracon: MatchedTracon[]): LineLayer => {
    const filterConditions = matchedTracon.map(tracon => [
        "all",
        ["==", ["get", "id"], tracon.traconInfo.id],
        ["in", tracon.traconInfo.callsignPrefix, ["get", "prefix"]]
    ]);

    return {
        id: "tracon-boundaries-layer",
        type: "line",
        source: "active-tracon-layers",
        "source-layer": "latest_tracon_boundaries",
        paint: {
            "line-color": "#04BDFF",
            "line-width": 2,
        },
        filter: ["any", ...filterConditions]
    };
};

export const activeTraconFillLayerStyle = (hoverInfo: HoverTracon | null): FillLayer => {
    const hoverTraconId = hoverInfo ? hoverInfo.traconInfo.id : null;
    const hoverCallsignPrefix = hoverInfo ? hoverInfo.traconInfo.callsignPrefix : null;

    return {
        id: "tracon-fill-layer",
        type: "fill",
        source: "active-tracon-layers",
        "source-layer": "latest_tracon_boundaries",
        paint: {
            "fill-color": "#27aef5",
            "fill-opacity": [
                "case",
                ["all",
                    ["==", ["get", "id"], hoverTraconId],
                    ["in", hoverCallsignPrefix, ["get", "prefix"]]
                ],
                0.4,
                0
            ]
        },
        filter: hoverTraconId && hoverCallsignPrefix
            ? ["all",
                ["==", ["get", "id"], hoverTraconId],
                ["in", hoverCallsignPrefix, ["get", "prefix"]]
            ]
            : ["has", "id"]
    };
};

// export const fallBackHighlightTraconFillLayerStyle: FillLayer = {
//     id: "fallback-highlight-tracon-boundaries-layer",
//     source: "fallback-tracon-geojson",
//     type: "fill",
//     paint: {
//         "fill-color": "#27aef5",
//         "fill-opacity": 0.4,
//     }
// };
export const fallBackHighlightTraconFillLayerStyle = (hoverCast: HoverTracon): FillLayer => {
    if (!hoverCast) return null;
    const hoverId = hoverCast.controllers.length > 0 ? hoverCast.controllers[0].callsign : null;

    return {
        id: "fallback-highlight-tracon-boundaries-layer",
        source: "fallback-tracon-geojson",
        type: "fill",
        paint: {
            "fill-color": "#27aef5",
            "fill-opacity": [
                "case",
                ["==", ["get", "id"], hoverId],
                0.4,
                0
            ]
        },
        filter: hoverId ? ["==", ["get", "id"], hoverId] : ["has", "id"]
    };
};

export const fallbackTraconBoundariesLineLayerStyle: LineLayer = {
    id: "fallback-tracon-boundaries-line-layer",
    source: "fallback-tracon-geojson",
    type: "line",
    paint: {
        "line-color": "#04BDFF",
        "line-width": 2
    }
};
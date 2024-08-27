import { FillLayer, LineLayer } from "react-map-gl";
import { MatchedTracon } from "../../../../hooks/useMatchTracon";

export const activeTraconLineLayerStyle = (matchedTracon: MatchedTracon[]): LineLayer => {

    //TODO: Wrong filter.
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

export const activeTraconFillLayerStyle = (hoverInfo: MatchedTracon | null): FillLayer => {
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

export const fallBackHighlightTraconFillLayerStyle: FillLayer = {
    id: "fallback-highlight-tracon-boundaries-layer",
    source: "fallback-tracon-geojson",
    type: "fill",
    paint: {
        "fill-color": "#27aef5",
        "fill-opacity": 0.4,
    }
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
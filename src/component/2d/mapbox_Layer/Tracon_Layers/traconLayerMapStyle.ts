import { FillLayer, LineLayer } from "react-map-gl";
import { MatchedTracon } from "../../../../hooks/useMatchTracon";

export const activeTraconLineLayerStyle = (matchedTracon: MatchedTracon[]): LineLayer => {
    // const filterConditions = ["any", ...matchedTracon.map(tracon => ["==", ["get", "id"], tracon.traconInfo.id])];

    const filterConditions = ["any", ...matchedTracon.map(tracon => {
        // Check if the controller's callsign contains any of the prefixes
        return tracon.traconInfo.prefix.map(prefix => [
            "all",
            ["==", ["get", "id"], tracon.traconInfo.id],
            ["in", prefix, ["get", "prefix"]]
        ]);
    })
        .flat()];

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



import { FillLayer, LineLayer } from "react-map-gl";
import { MatchedFir } from "../../../../hooks/useMatchedFirs";

export const activeFirLayerStyle = (
    matchedFirs: {
        id: string;
        oceanic: string;
    }[],
    hoverFir: MatchedFir
): FillLayer => {
    const hoverFirId = hoverFir ? hoverFir.firInfo.firBoundary : null;

    const filterConditions = matchedFirs.map((fir) => [
        "all",
        ["==", ["get", "id"], fir.id],
        ["==", ["get", "oceanic"], fir.oceanic],
    ]);

    return {
        id: "fir-boundaries-layer",
        type: "fill",
        maxzoom: 10,
        source: "active-fir-layers",
        "source-layer": "latest_fir_boundaries",
        paint: {
            "fill-color": "#9499a8",
            "fill-opacity": ["case", ["==", ["get", "id"], hoverFirId], 0.5, 0.3],
            "fill-outline-color": "#FFFFFF",
        },
        filter: ["any", ...filterConditions],
    };
};

export const underlineBoundariesLineStyle: LineLayer = {
    id: "fir-underline-boundaries-line-layer",
    source: "fir-outline-boundaries-source",
    "source-layer": "latest_fir_boundaries",
    type: "line",
    paint: {
        "line-color": "#9499a8",
        "line-width": 0.5,
    },
};

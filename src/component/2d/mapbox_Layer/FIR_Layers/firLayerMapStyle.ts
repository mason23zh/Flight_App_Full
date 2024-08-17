import { FillLayer, LineLayer } from "react-map-gl";
import { MatchedFir } from "../../../../hooks/useMatchedFirs";

export const activeFirLayerStyle = (matchedFirIds: string[], hoverFir: MatchedFir): FillLayer => {
    const hoverFirId = hoverFir ? hoverFir.id : null;
    return {
        id: "fir-boundaries-layer",
        type: "fill",
        source: "active-fir-layers",
        "source-layer": "firboundaries",
        paint: {
            "fill-color": "#9499a8",
            "fill-opacity": [
                "case",
                ["==", ["get", "id"], hoverFirId],
                0.5,
                0.3
            ],
            "fill-outline-color": "#FFFFFF",
        },
        filter: ["in", "id", ...matchedFirIds],
    };
};


export const underlineBoundariesLineStyle: LineLayer = {
    id: "fir-underline-boundaries-line-layer",
    source: "fir-outline-boundaries-source",
    "source-layer": "firboundaries",
    type: "line",
    paint: {
        "line-color": "#9499a8",
        "line-width": 0.5
    }
};


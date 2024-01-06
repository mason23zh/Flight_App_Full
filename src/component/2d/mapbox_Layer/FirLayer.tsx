import React from "react";
import { Layer } from "react-map-gl";

const FirLayer = () => {
    return (
        <Layer
            type="fill"
            source="fir-boundary-source"
            source-layer="firboundaries"
            id="fir-canada"
            filter={["in", "id", "CZEG", "KZMP", "EGTT-S"]}
            // minzoom={1}
            paint={{
                "fill-color": "rgba(230, 230, 211, 0.351)"
            }}
        />
    );
};

export default FirLayer;
import React, { useEffect, useState } from "react";
import { Layer } from "react-map-gl";
import { VatsimControllers } from "../../../../types";

interface Controller {
    controllerInfo: VatsimControllers;
}

const FirHighLightLayer = ({ controllerInfo }: Controller, selectedFir: string) => {
    const [filter, setFilter] = useState([]);
    // useEffect(() => {
    //     setFilter(["in", "id", selectedFir]);
    // }, [selectedFir]);

    if (filter.length > 2) {
        return (
            <Layer
                type="fill"
                source="fir-boundary-source"
                source-layer="firboundaries"
                id="firs-highlight"
                filter={["in", "in", "EGTT"]}
                paint={{
                    "fill-outline-color": "rgb(255,255,255)",
                    "fill-color": "rgba(233,47,47, 0.351)",
                    "fill-opacity": 0.8
                }}
            />
        );
    }
};

export default React.memo(FirHighLightLayer);
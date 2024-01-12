import React, { useEffect, useState } from "react";
import { Layer } from "react-map-gl";
import { VatsimControllers } from "../../../types";

interface Controller {
    controllerInfo: VatsimControllers;
}

const FirTextLayer = ({ controllerInfo }: Controller) => {
    const [filter, setFilter] = useState([]);
    useEffect(() => {
        console.log("Controller info:", controllerInfo);
        if (controllerInfo && controllerInfo.fir.length > 0) {
            const firArray = ["in", "id", ...filter];
            controllerInfo.fir.forEach((c) => {
                firArray.push(c.fir);
            });
            // console.log("filter array", filter);
            // console.log("filter:", firArray);
            setFilter(firArray);
            console.log("filter:", filter);
        }
    }, [controllerInfo]);

    if (filter.length > 2) {
        return (
            <Layer
                type="symbol"
                source="fir_labels"
                source-layer="fir_labels-9mxj66"
                id="fir-text"
                filter={filter}
                layout={{
                    "text-max-width": 4,
                    "text-size": 15,
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-field": ["get", "id"],
                    "text-offset": [0, 0],
                    "text-anchor": "top",
                    "text-allow-overlap": false
                }}
                paint={{
                    "text-color": "#212224",
                }}
            />

        );
    }
};

export default React.memo(FirTextLayer);
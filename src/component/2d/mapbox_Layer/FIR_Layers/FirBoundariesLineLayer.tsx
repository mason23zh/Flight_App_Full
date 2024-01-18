import React, { useEffect, useState } from "react";
import { VatsimControllers } from "../../../../types";
import { Layer } from "react-map-gl";

interface Controller {
    controllerInfo: VatsimControllers;
}

const FirBoundariesLineLayer = ({ controllerInfo }: Controller) => {
    const [filter, setFilter] = useState([]);
    useEffect(() => {
        if (controllerInfo && controllerInfo.fir.length > 0) {
            const firArray = ["in", "id"];
            controllerInfo.fir.forEach((c) => {
                let fir = c.fir;

                if (c.callsign.split("_").length === 3) {
                    const prefix = c.callsign.split("_")[1];
                    if (isNaN(+prefix)) {
                        fir = c.fir + "-" + c.callsign.split("_")[1];
                    }
                }
                firArray.push(fir);
            });
            setFilter(firArray);
        }
    }, [controllerInfo]);


    if (filter.length > 2) {
        return (
            <Layer
                type="line"
                source="fir-boundary-source"
                source-layer="firboundaries"
                id="firs-boundary-line"
                filter={filter}
                paint={{
                    "line-color": "#FFFFFF",
                    "line-width": 1.5
                }}
            />
        );
    }
};

export default FirBoundariesLineLayer;
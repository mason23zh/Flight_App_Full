import React, { useEffect, useState } from "react";
import { Layer } from "react-map-gl";
import { VatsimControllers } from "../../../../types";

interface Controller {
    controllerInfo: VatsimControllers;
}

const FirLayer = ({ controllerInfo }: Controller) => {
    const [filter, setFilter] = useState([]);
    useEffect(() => {
        if (controllerInfo && controllerInfo.fir.length > 0) {
            const firArray = ["in", "id", ...filter];
            controllerInfo.fir.forEach((c) => {
                firArray.push(c.fir);
            });
            setFilter(firArray);
        }
    }, [controllerInfo]);


    if (filter.length > 2) {
        return (
            <Layer
                type="fill"
                source="fir-boundary-source"
                source-layer="firboundaries"
                id="firs"
                filter={filter}
                paint={{
                    "fill-outline-color": "rgb(255,255,255)",
                    "fill-color": "rgba(230, 230, 211, 0.351)",
                    "fill-opacity": 0.8
                }}
            />
        );
    }
};


export default React.memo(FirLayer);

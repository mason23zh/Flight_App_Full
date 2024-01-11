import React, { useEffect, useState } from "react";
import { Layer } from "react-map-gl";
import { VatsimControllers } from "../../../types";

interface Controller {
    controllerInfo: VatsimControllers;
}

const FirLayer = ({ controllerInfo }: Controller) => {
    console.log("Fir layer render");
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
        }
    }, [controllerInfo]);


    if (filter.length > 2) {
        // console.log("Filter:", filter);
        return (
            <Layer
                type="fill"
                source="fir-boundary-source"
                source-layer="firboundaries"
                id="fir-canada"
                filter={filter}
                // minzoom={1}
                paint={{
                    "fill-color": "rgba(230, 230, 211, 0.351)"
                }}
            />
        );
    }

};

export default React.memo(FirLayer);
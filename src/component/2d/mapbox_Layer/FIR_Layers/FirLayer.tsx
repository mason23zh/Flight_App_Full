import React, { useEffect, useState } from "react";
import { Layer } from "react-map-gl";
import { VatsimControllers } from "../../../../types";

interface Controller {
    controllerInfo: VatsimControllers;
}

const FirLayer = ({ controllerInfo }: Controller) => {
    console.log("FIR layer render");
    const [filter, setFilter] = useState([]);
    useEffect(() => {
        if (controllerInfo && controllerInfo.fir.length > 0) {
            const firArray = ["in", "id"];
            controllerInfo.fir.forEach((c) => {
                let fir = c.fir;
                //! EDDM FIR won't render
                if (c.callsign.split("_").length === 3) {
                    const prefix = c.callsign.split("_")[1];
                    if (isNaN(+prefix)) {
                        fir = c.fir + "-" + c.callsign.split("_")[1];
                    }
                }
                firArray.push(fir);
            });
            console.log("fir array:", firArray);
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

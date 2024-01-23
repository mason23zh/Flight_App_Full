import React, { useEffect, useState } from "react";
import { VatsimControllers } from "../../../../types";
import { MapRef } from "react-map-gl";

// import fir_labels from "../../../../assets/mapbox/fir_labels.json";

interface Controller {
    controllerInfo: VatsimControllers;
}

const FirNameMarkerLayer = ({ controllerInfo }: Controller, mapRef: React.RefObject<MapRef>) => {
    const [filter, setFilter] = useState([]);
    useEffect(() => {
        console.log("Controller info:", controllerInfo);
        if (controllerInfo && controllerInfo.fir.length > 0) {
            const firArray = ["in", "id"];
            controllerInfo.fir.forEach((c) => {
                firArray.push(c.fir);
            });
            // console.log("filter array", filter);
            // console.log("filter:", firArray);
            setFilter(firArray);
            // console.log("filter:", filter);
        }

        //
        // for (const item in JSON.parse(fir_labels)) {
        //     console.log(item);
        // }


        if (mapRef.current) {
            const map = mapRef.current.getMap();

            if (map.getSource("fir-text")) {
                const feature = map.queryRenderedFeatures();
                console.log("map ref features:", feature);
            }
        }

    }, [controllerInfo, mapRef]);


    return (
        <div>

        </div>
    );
};

export default FirNameMarkerLayer;
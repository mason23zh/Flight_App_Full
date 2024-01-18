import React, { useEffect, useState } from "react";
import { Layer } from "react-map-gl";
import { VatsimControllers } from "../../../../types";

interface Controller {
    controllerInfo: VatsimControllers;
}

type FilterType = (string | boolean | FilterType)[]


const TraconBoundariesLineLayer = ({ controllerInfo }: Controller) => {
    console.log("Tracon boundaries line layer render");
    const [filter, setFilter] = useState([]);

    useEffect(() => {
        if (controllerInfo && controllerInfo.other.controllers.length > 0) {
            const filterExpression: FilterType = ["any"];
            controllerInfo.other.controllers.forEach((c) => {
                if (c.facility === 5) {
                    const prefix = c.callsign.split("_")[0];
                    filterExpression.push(["in", prefix, ["get", "prefix"]]);
                }
            });

            setFilter(filterExpression);
        }
    }, [controllerInfo]);
    if (filter.length > 0) {
        return (
            <Layer
                type="line"
                source="tracon-source-layer"
                source-layer="traconboundaries-9z4gpn"
                id="tracons-boundaries-line"
                filter={filter}
                paint={{
                    "line-color": "#04BDFF",
                    "line-width": 1
                }}
            />
        );
    }
};

export default React.memo(TraconBoundariesLineLayer);
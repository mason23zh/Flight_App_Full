import React, { useEffect, useState } from "react";
import { Layer } from "react-map-gl";
import { VatsimControllers } from "../../../../types";

interface Controller {
    controllerInfo: VatsimControllers;
}

type FilterType = (string | boolean | FilterType)[]
/*
* [
    "any",
     ["in", "BOS", ["get", "prefix"]],
     ["in", "BWI", ["get", "prefix"]]
  ]
* */

const TraconLayer = ({ controllerInfo }: Controller) => {
    console.log("Tracon layer render");
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
                type="fill"
                source="tracon-source-layer"
                source-layer="traconboundaries-9z4gpn"
                id="tracons"
                filter={filter}
                paint={{
                    "fill-outline-color": "rgb(12,91,231)",
                    "fill-color": "rgba(39, 174, 245, 0.3)",
                    "fill-opacity": 0.8
                }}
            />
        );
    }
};

export default React.memo(TraconLayer);
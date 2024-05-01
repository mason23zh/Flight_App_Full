import React from "react";
import { getDayNightTerminator } from "../util/getDayNightTerminator";
import { Layer, Source } from "react-map-gl";
import { dayNightTerminatorStyle } from "./dayNightTerminatorLayerStyle";


const DayNightLayer = () => {
    const geoJsonData = getDayNightTerminator();
    if (!geoJsonData) {
        return null;
    } else {
        return (
            <Source type="geojson" data={getDayNightTerminator()}>
                <Layer {...dayNightTerminatorStyle} />
            </Source>);
    }
};

export default DayNightLayer;
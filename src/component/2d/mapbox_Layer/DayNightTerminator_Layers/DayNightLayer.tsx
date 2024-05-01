import React, { useEffect, useState } from "react";
import { getDayNightTerminator } from "../util/getDayNightTerminator";
import GeoJson from "geojson";
import { Layer, Source } from "react-map-gl";
import { dayNightTerminatorStyle } from "./dayNightTerminatorLayerStyle";
import moment from "moment";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Style } from "ol/style";
import GeoJsonTerminator from "@webgeodatavore/geojson.terminator";
import { GeoJSON } from "ol/format";


const DayNightLayer = () => {

    return (
        <Source type="geojson" data={getDayNightTerminator()}>
            <Layer {...dayNightTerminatorStyle} />
        </Source>);
};

export default DayNightLayer;
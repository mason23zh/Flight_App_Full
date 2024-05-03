/*
* Render all Firs boundaries lines
*/
import React from "react";
import GeoJson from "geojson";
import { Layer, Source } from "react-map-gl";
import { underlineBoundariesLineStyle } from "./firLayerMapStyle";

interface FirUnderlineLayerProps {
    geoJsonData: GeoJson.FeatureCollection;
}

const FirUnderlineLayer = ({ geoJsonData }: FirUnderlineLayerProps) => {
    if (geoJsonData) {
        return (
            <Source type="geojson" data={geoJsonData}>
                <Layer {...underlineBoundariesLineStyle}/>
            </Source>
        );
    }
};

export default React.memo(FirUnderlineLayer);
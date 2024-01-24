import React from "react";
import useFetchVatsimTraconData from "../../../../hooks/useFetchVatsimTraconData";
import useMatchTraconFeatures from "../../../../hooks/useMatchTraconFeatures";
import { VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import { traconBoundariesLayerStyle } from "./traconLayerMapStyle";

interface Controller {
    controllerInfo: VatsimControllers;
}

const TestTraconLayer = ({ controllerInfo }: Controller) => {
    const [traconBoundariesData] = useFetchVatsimTraconData();
    const geoJsonFeatures = useMatchTraconFeatures(controllerInfo, traconBoundariesData);
    console.log("GeoJson features:", geoJsonFeatures);


    return (
        <Source type="geojson" data={geoJsonFeatures}>
            <Layer {...traconBoundariesLayerStyle}/>
        </Source>
    );
};

export default TestTraconLayer;
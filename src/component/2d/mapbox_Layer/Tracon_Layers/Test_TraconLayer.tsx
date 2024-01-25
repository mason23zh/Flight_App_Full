import React from "react";
import useFetchVatsimTraconData from "../../../../hooks/useFetchVatsimTraconData";
import useMatchTraconFeatures from "../../../../hooks/useMatchTraconFeatures";
import { VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import { traconBoundariesLayerStyle, traconBoundariesLineLayerStyle } from "./traconLayerMapStyle";
import useRenderTraconLabelMarker from "../../../../hooks/useRenderTraconLabelMarker";

interface Controller {
    controllerInfo: VatsimControllers;
}


const TestTraconLayer = ({ controllerInfo }: Controller) => {
    console.log("Test Tracon Layer render.");
    const [traconBoundariesData] = useFetchVatsimTraconData();
    const geoJsonFeatures = useMatchTraconFeatures(controllerInfo, traconBoundariesData);
    const { renderedMarkers } = useRenderTraconLabelMarker(geoJsonFeatures);
    // console.log("GeoJson features:", geoJsonFeatures);


    return (
        <Source type="geojson" data={geoJsonFeatures}>
            {/* <Layer {...traconBoundariesLayerStyle}/> */}
            <Layer {...traconBoundariesLineLayerStyle}/>
            {renderedMarkers}
        </Source>
    );
};

export default React.memo(TestTraconLayer);
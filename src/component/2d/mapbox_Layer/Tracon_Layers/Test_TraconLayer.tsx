import React from "react";
import useFetchVatsimTraconData from "../../../../hooks/useFetchVatsimTraconData";
import useMatchTraconFeatures from "../../../../hooks/useMatchTraconFeatures";
import { VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import {
    highlightTraconBoundariesLayerStyle,
    traconBoundariesLayerStyle,
    traconBoundariesLineLayerStyle
} from "./traconLayerMapStyle";
import useRenderTraconLabelMarker from "../../../../hooks/useRenderTraconLabelMarker";

interface Controller {
    controllerInfo: VatsimControllers;
}


const TestTraconLayer = ({ controllerInfo }: Controller) => {
    console.log("Test Tracon Layer render.");
    const [traconBoundariesData] = useFetchVatsimTraconData();
    const geoJsonFeatures = useMatchTraconFeatures(controllerInfo, traconBoundariesData);
    const {
        renderedMarkers,
        hoverTracon
    } = useRenderTraconLabelMarker(geoJsonFeatures);
    // console.log("GeoJson features:", geoJsonFeatures);


    return (
        <Source type="geojson" data={geoJsonFeatures}>
            <Layer {...traconBoundariesLineLayerStyle}/>
            {hoverTracon &&
                <Source type="geojson" data={hoverTracon}>
                    <Layer {...highlightTraconBoundariesLayerStyle}/>
                </Source>
            }
            {renderedMarkers}
        </Source>
    );
};

export default React.memo(TestTraconLayer);
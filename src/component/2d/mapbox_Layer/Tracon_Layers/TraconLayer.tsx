import React from "react";
import useMatchTraconFeatures from "../../../../hooks/useMatchTraconFeatures";
import { VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import {
    highlightTraconBoundariesLayerStyle,
    traconBoundariesLineLayerStyle
} from "./traconLayerMapStyle";
import useRenderTraconLabelMarker from "../../../../hooks/useRenderTraconLabelMarker";
import TraconLabelPopup from "./TraconLabelPopup";

interface Controller {
    controllerInfo: VatsimControllers;
    labelVisible: boolean;
}

const TraconLayer = ({
    controllerInfo,
    labelVisible
}: Controller) => {
    console.log("Test Tracon Layer render.");
    // const [traconBoundariesData] = useFetchVatsimTraconData();
    const {
        geoJsonFeatures,
        isLoading,
        error
    } = useMatchTraconFeatures(controllerInfo);
    const {
        renderedMarkers,
        hoverTracon
    } = useRenderTraconLabelMarker(geoJsonFeatures);

    if (isLoading) {
        return (
            <>
                Loading...
            </>
        );
    }

    if (error) {
        return (
            <>
                Error
            </>
        );
    }

    if (geoJsonFeatures) {
        return (
            <Source type="geojson" data={geoJsonFeatures}>
                <Layer {...traconBoundariesLineLayerStyle}/>
                {(hoverTracon && labelVisible) &&
                    <Source type="geojson" data={hoverTracon}>
                        <Layer {...highlightTraconBoundariesLayerStyle}/>
                        <TraconLabelPopup hoverTracon={hoverTracon}/>
                    </Source>
                }
                {labelVisible && renderedMarkers}
            </Source>
        );
    }
};

export default React.memo(TraconLayer);
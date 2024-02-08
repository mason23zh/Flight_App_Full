import React, { useEffect } from "react";
import useMatchTraconFeatures from "../../../../hooks/useMatchTraconFeatures";
import { VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import {
    highlightTraconBoundariesLayerStyle,
    traconBoundariesLineLayerStyle
} from "./traconLayerMapStyle";
import useRenderTraconLabelMarker from "../../../../hooks/useRenderTraconLabelMarker";
import TraconLabelPopup from "./TraconLabelPopup";
import { useDispatch } from "react-redux";
import { addMessage } from "../../../../store";

interface Controller {
    controllerInfo: VatsimControllers;
    labelVisible: boolean;
}

const TraconLayer = ({
    controllerInfo,
    labelVisible
}: Controller) => {
    const dispatch = useDispatch();

    const {
        geoJsonFeatures,
        isLoading,
        error
    } = useMatchTraconFeatures(controllerInfo);
    const {
        renderedMarkers,
        hoverTracon
    } = useRenderTraconLabelMarker(geoJsonFeatures);

    useEffect(() => {
        if (isLoading) {
            dispatch(addMessage("Loading Tracon layer..."));
        }

        if (error) {
            dispatch(addMessage("Error loading Tracon layer."));
        }
    }, [isLoading, error]);


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
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
import { addMessage, removeMessageByLocation } from "../../../../store";
import { isFeatureCollection } from "../util/helpers";

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
            dispatch(addMessage({
                location: "TRACON",
                messageType: "LOADING",
                content: "Loading Tracon layer..."
            }));
        }

        if (error) {
            console.log("Tracon layer error", error);
            dispatch(addMessage({
                location: "TRACON",
                messageType: "ERROR",
                content: "Error loading Tracon layer."
            }));
        }
        if (geoJsonFeatures && !error && !isLoading) {
            dispatch(removeMessageByLocation({ location: "TRACON" }));
        }
    }, [isLoading, error, geoJsonFeatures]);


    if (geoJsonFeatures) {
        return (
            <Source type="geojson" data={geoJsonFeatures}>
                <Layer {...traconBoundariesLineLayerStyle}/>
                {(hoverTracon && labelVisible && isFeatureCollection(hoverTracon)) &&
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
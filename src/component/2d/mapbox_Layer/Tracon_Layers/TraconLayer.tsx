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
import useMatchTracon from "../../../../hooks/useMatchTracon";

interface Controller {
    controllerInfo: VatsimControllers;
    labelVisible: boolean;
}

//!fix: LGA_V_APP
//TODO: Try to avoid using geoJson

const TraconLayer = ({
    controllerInfo,
    labelVisible
}: Controller) => {
    const dispatch = useDispatch();

    useMatchTracon(controllerInfo);

    const {
        geoJsonFeatures,
        isLoading,
        error
    } = useMatchTraconFeatures(controllerInfo);
    const {
        renderedMarkers,
        hoverTraconCast,
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
            <Source
                id="active-tracon-layers"
                type="vector"
                url="mapbox://mason-zh.cm04i1y2uaj211uo5ad8y37hg-5vcaj"
            >
                <Layer {...traconBoundariesLineLayerStyle}/>
            </Source>
        );
    }
    //
    // if (geoJsonFeatures) {
    //     return (
    //         <Source type="geojson" data={geoJsonFeatures}>
    //             <Layer {...traconBoundariesLineLayerStyle}/>
    //             {(hoverTraconCast && labelVisible && isFeatureCollection(hoverTraconCast)) &&
    //                 <Source type="geojson" data={hoverTraconCast}>
    //                     <Layer {...highlightTraconBoundariesLayerStyle}/>
    //                     <TraconLabelPopup hoverTracon={hoverTraconCast}/>
    //                 </Source>
    //             }
    //             {labelVisible && renderedMarkers}
    //         </Source>
    //     );
    // }
};

export default React.memo(TraconLayer);
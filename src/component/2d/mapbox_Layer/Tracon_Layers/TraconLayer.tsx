import React, { useEffect } from "react";
import { VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import {
    activeTraconFillLayerStyle,
    activeTraconLineLayerStyle,
    fallbackHighlightTraconBoundariesLayerStyle,
    fallBackHighlightTraconBoundariesLayerStyle, fallbackTraconBoundariesLineLayerStyle,
} from "./traconLayerMapStyle";
import useRenderTraconLabelMarker from "../../../../hooks/useRenderTraconLabelMarker";
import TraconLabelPopup from "./TraconLabelPopup";
import { useDispatch } from "react-redux";
import { addMessage, removeMessageByLocation } from "../../../../store";
import useMatchTracon from "../../../../hooks/useMatchTracon";

interface Controller {
    controllerInfo: VatsimControllers;
    labelVisible: boolean;
}

//!fix: LGA_V_APP

const TraconLayer = ({
    controllerInfo,
    labelVisible
}: Controller) => {
    const dispatch = useDispatch();

    const {
        matchedTracons,
        fallbackGeoJson, //fallback GeoJSON data
        matchedFallbackTracons, // fallback controller info
        isLoading: isTraconLoading,
        isError: isTraconError
    } = useMatchTracon(controllerInfo);

    if (fallbackGeoJson && matchedFallbackTracons) {
        console.log("FALL BACK:", fallbackGeoJson);
        console.log("FALL BACK data:", matchedFallbackTracons);
    }

    const {
        renderedMarkers,
        hoverTraconCast,
    } = useRenderTraconLabelMarker(matchedTracons);

    useEffect(() => {
        if (isTraconLoading) {
            dispatch(addMessage({
                location: "TRACON",
                messageType: "LOADING",
                content: "Loading Tracon layer..."
            }));
        }

        if (isTraconError) {
            dispatch(addMessage({
                location: "TRACON",
                messageType: "ERROR",
                content: "Error loading Tracon layer."
            }));
        }
        if (matchedTracons && !isTraconError && !isTraconLoading) {
            dispatch(removeMessageByLocation({ location: "TRACON" }));
        }
    }, [isTraconError, isTraconLoading, controllerInfo]);


    if (matchedTracons) {
        const activeTraconOutlineStyle = activeTraconLineLayerStyle(matchedTracons);
        const activeHoverTraconLayerStyle = activeTraconFillLayerStyle(hoverTraconCast);
        return (
            <>
                <Source
                    id="active-tracon-layers"
                    type="vector"
                    url="mapbox://mason-zh.cm04i1y2uaj211uo5ad8y37hg-5vcaj"
                >
                    <Layer {...activeTraconOutlineStyle}/>
                    {(hoverTraconCast && labelVisible) && (
                        <>
                            <Layer {...activeHoverTraconLayerStyle} />
                            <TraconLabelPopup hoverTracon={hoverTraconCast}/>
                        </>
                    )
                    }
                    {labelVisible && renderedMarkers}
                </Source>

                {fallbackGeoJson && matchedFallbackTracons && fallbackGeoJson.features.length > 0 &&
                            (
                                <Source
                                    id="fallback-tracon-geojson"
                                    type="geojson"
                                    data={fallbackGeoJson}
                                >
                                    <Layer {...fallbackTraconBoundariesLineLayerStyle}/>
                                </Source>
                            )
                }
            </>
        );
    }
};

export default React.memo(TraconLayer);
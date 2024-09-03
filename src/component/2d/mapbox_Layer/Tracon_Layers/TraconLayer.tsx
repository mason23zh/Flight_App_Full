import React, { useEffect } from "react";
import { VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import {
    activeTraconFillLayerStyle,
    activeTraconLineLayerStyle,
    fallBackHighlightTraconFillLayerStyle,
    fallbackTraconBoundariesLineLayerStyle,
} from "./traconLayerMapStyle";
import useRenderTraconLabelMarker from "../../../../hooks/useRenderTraconLabelMarker";
import TraconLabelPopup from "./TraconLabelPopup";
import { useDispatch } from "react-redux";
import { addMessage, removeMessageByLocation } from "../../../../store";
import useMatchTracon from "../../../../hooks/useMatchTracon";
import useRenderUnMatchedTraconLabelMarkers from "../../../../hooks/useRenderUnMatchedTraconLabelMarkers";

interface Controller {
    controllerInfo: VatsimControllers;
    labelVisible: boolean;
}

//TODO: Clean up here, add hover state in redux.
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

    const {
        renderedMarkers,
        hoverTraconCast,
    } = useRenderTraconLabelMarker(matchedTracons);

    const {
        renderedMarkers: fallbackMarkers,
        hoverTraconCast: fallbackHover
    } = useRenderUnMatchedTraconLabelMarkers(matchedFallbackTracons);


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
        const fallbackHoverTraconFillStyle = fallBackHighlightTraconFillLayerStyle(fallbackHover);
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
                    {/* {labelVisible && renderedMarkers} */}
                </Source>

                {fallbackGeoJson &&
                            matchedFallbackTracons &&
                            fallbackGeoJson.features.length > 0 &&
                            (
                                <Source
                                    id="fallback-tracon-geojson"
                                    type="geojson"
                                    data={fallbackGeoJson}
                                >
                                    <Layer {...fallbackTraconBoundariesLineLayerStyle}/>

                                    {(fallbackHover && labelVisible) && (
                                        <>
                                            <Layer {...fallbackHoverTraconFillStyle}/>
                                            {/* <TraconLabelPopup hoverTracon={fallbackHover}/> */}
                                        </>
                                    )}
                                    {/* {labelVisible && fallbackMarkers} */}
                                </Source>
                            )
                }
            </>
        );
    }
};

export default React.memo(TraconLayer);
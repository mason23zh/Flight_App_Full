import React, { useEffect } from "react";
import { VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import {
    activeTraconFillLayerStyle,
    activeTraconLineLayerStyle,
    fallBackHighlightTraconFillLayerStyle,
    fallbackTraconBoundariesLineLayerStyle,
} from "./traconLayerMapStyle";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, removeMessageByLocation, RootState } from "../../../../store";

interface Controller {
    controllerInfo: VatsimControllers;
}

const TraconLayer = ({
    controllerInfo,
}: Controller) => {
    const dispatch = useDispatch();
    const {
        matchedFallbackTracons,
        matchedTracons,
        fallbackGeoJson,
        hoveredTracon,
        isLoading: isTraconLoading,
        isError: isTraconError
    } = useSelector((state: RootState) => state.matchedTracons);


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
    }, [isTraconError, isTraconLoading, controllerInfo, matchedTracons, matchedFallbackTracons]);


    if (matchedTracons) {
        const activeTraconOutlineStyle = activeTraconLineLayerStyle(matchedTracons);
        const activeHoverTraconLayerStyle = activeTraconFillLayerStyle(hoveredTracon);
        const fallbackHoverTraconFillStyle = fallBackHighlightTraconFillLayerStyle(hoveredTracon);
        return (
            <>
                <Source
                    id="active-tracon-layers"
                    type="vector"
                    url="mapbox://mason-zh.cm04i1y2uaj211uo5ad8y37hg-5vcaj"
                >
                    <Layer {...activeTraconOutlineStyle}/>
                    {(hoveredTracon && hoveredTracon.traconInfo.id) && <Layer {...activeHoverTraconLayerStyle}/>}
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
                                    {hoveredTracon && <Layer {...fallbackHoverTraconFillStyle}/>}
                                </Source>
                            )
                }
            </>
        );
    }
};

export default React.memo(TraconLayer);
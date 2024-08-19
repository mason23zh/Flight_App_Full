// The source layer to render FIR data.

import React, { useEffect } from "react";
import { VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import { activeFirLayerStyle } from "./firLayerMapStyle";
import useRenderFirLabelMarker from "../../../../hooks/useRenderFirLabelMarker";
import FirLabelPopup from "./FirLabelPopup";
import { useDispatch } from "react-redux";
import { addMessage, removeMessageByLocation } from "../../../../store";
import useMatchedFirs, { MatchedFir } from "../../../../hooks/useMatchedFirs";

interface Controller {
    controllerInfo: VatsimControllers;
    labelVisible: boolean;
}

const FirLayer = ({
    controllerInfo,
    labelVisible,
}: Controller) => {

    if (!controllerInfo) return null;

    const dispatch = useDispatch();
    console.log("Fir layer run");

    const {
        matchedFirs: matchedFIRS,
        isLoading,
        isError
    } = useMatchedFirs(controllerInfo);
    console.log("MatchedFIRS:", matchedFIRS);

    useEffect(() => {
        if (isLoading) {
            dispatch(addMessage({
                location: "FIR",
                messageType: "LOADING",
                content: "Loading Fir layer..."
            }));
        }

        if (isError) {
            dispatch(addMessage({
                location: "FIR",
                messageType: "ERROR",
                content: "Error loading Fir layer."
            }));
        }

        if (matchedFIRS?.length > 0 && !isError) {
            dispatch(removeMessageByLocation({ location: "FIR" }));
        }
    }, [isLoading, isError, matchedFIRS]);

    const {
        renderedMarkers,
        hoverFir
    } = useRenderFirLabelMarker(matchedFIRS);

    const hoverFirCast = hoverFir as MatchedFir;

    if (isLoading || isError) {
        return null;
    }

    if (matchedFIRS) {
        const matchedFirs = matchedFIRS.map(fir => ({
            id: fir.firInfo.firBoundary,
            oceanic: fir.firInfo?.entries[0]?.oceanic || "0"
        }));
        const layerStyle = activeFirLayerStyle(matchedFirs, hoverFirCast);

        return (
            <Source
                id="active-fir-layers"
                type="vector"
                url="mapbox://mason-zh.cm00590z503li1tlkgyy8e5s3-5pv1b"
            >
                <Layer {...layerStyle} />
                {(hoverFir && labelVisible) &&
                    <FirLabelPopup hoverFir={hoverFirCast}/>
                }
                {labelVisible && renderedMarkers}
            </Source>
        );
    }
};

export default React.memo(FirLayer);
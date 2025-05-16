// The source layer to render FIR data.

import React, { useEffect, useMemo } from "react";
import { VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import { activeFirLayerStyle } from "./firLayerMapStyle";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, removeMessageByLocation, RootState } from "../../../../store";

interface Controller {
    controllerInfo: VatsimControllers;
}

const FirLayer = ({ controllerInfo }: Controller) => {
    const dispatch = useDispatch();
    const {
        matchedFirs: matchedFIRS,
        hoveredFir,
        isError: errorMatchedFirs,
    } = useSelector((state: RootState) => state.matchedFirs);

    useEffect(() => {
        if (errorMatchedFirs) {
            dispatch(
                addMessage({
                    location: "FIR",
                    messageType: "ERROR",
                    content: "Error loading Fir layer.",
                })
            );
        }

        if (matchedFIRS?.length > 0 && !errorMatchedFirs) {
            dispatch(removeMessageByLocation({ location: "FIR" }));
        }
    }, [errorMatchedFirs, matchedFIRS]);

    const matchedFirs = matchedFIRS.map((fir) => ({
        id: fir.firInfo.firBoundary,
        oceanic: fir.firInfo?.entries[0]?.oceanic || "0",
    }));
    const layerStyle = useMemo(
        () => activeFirLayerStyle(matchedFirs, hoveredFir),
        [matchedFirs, hoveredFir]
    );

    if (!controllerInfo || errorMatchedFirs) {
        return null;
    }

    if (matchedFIRS) {
        return (
            <Source
                id="active-fir-layers"
                type="vector"
                url="mapbox://mason-zh.cm00590z503li1tlkgyy8e5s3-5pv1b"
            >
                <Layer {...layerStyle} />
            </Source>
        );
    }
};

export default React.memo(FirLayer);

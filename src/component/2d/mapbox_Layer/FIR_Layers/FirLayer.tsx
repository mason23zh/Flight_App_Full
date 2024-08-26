// The source layer to render FIR data.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { VatsimControllers } from "../../../../types";
import { Layer, Source, useMap } from "react-map-gl";
import { _activeFirLayerStyle, activeFirLayerStyle } from "./firLayerMapStyle";
import useRenderFirLabelMarker from "../../../../hooks/useRenderFirLabelMarker";
import FirLabelPopup from "./FirLabelPopup";
import { useDispatch } from "react-redux";
import { addMessage, removeMessageByLocation } from "../../../../store";
import useMatchedFirs, { MatchedFir } from "../../../../hooks/useMatchedFirs";
import { useViewState } from "../../viewStateContext";
import useGenerateFirGeoJson from "../../../../hooks/useGenerateFirGeoJson";
import geoJsonTestData from "../../../../assets/Vatsim/fir-boundaries.json";

interface Controller {
    controllerInfo: VatsimControllers;
    labelVisible: boolean;
}

const FirLayer = ({
    controllerInfo,
    labelVisible,
}: Controller) => {

    const [firGeoJson, setFirGeoJson] = useState(null);


    // if (!controllerInfo) return null;

    const dispatch = useDispatch();
    console.log("Fir layer run");

    const {
        matchedFirs: matchedFIRS,
        isLoading: matchFirLoading,
        isError: matchFirError
    } = useMatchedFirs(controllerInfo);

    const {
        activeFirFeatures,
        isLoading: firFeaturesLoading,
        isError: firFeaturesError
    } = useGenerateFirGeoJson(matchedFIRS);


    useEffect(() => {
        if (matchFirLoading || firFeaturesLoading) {
            dispatch(addMessage({
                location: "FIR",
                messageType: "LOADING",
                content: "Loading Fir layer..."
            }));
        }

        if (matchFirError || firFeaturesError) {
            dispatch(addMessage({
                location: "FIR",
                messageType: "ERROR",
                content: "Error loading Fir layer."
            }));
        }

        if (matchedFIRS?.length > 0 && !matchFirError) {
            dispatch(removeMessageByLocation({ location: "FIR" }));
        }
    }, [matchFirLoading, matchFirError, firFeaturesLoading, firFeaturesError, matchedFIRS]);

    const {
        renderedMarkers,
        hoverFir
    } = useRenderFirLabelMarker(matchedFIRS);

    const hoverFirCast = hoverFir as MatchedFir;

    const matchedFirs = matchedFIRS.map(fir => ({
        id: fir.firInfo.firBoundary,
        oceanic: fir.firInfo?.entries[0]?.oceanic || "0"
    }));
    const layerStyle = useMemo(() => activeFirLayerStyle(matchedFirs, hoverFirCast),
        [JSON.stringify(matchedFirs), hoverFirCast]
    );


    if (matchFirLoading || matchFirError || firFeaturesLoading || firFeaturesError) {
        return null;
    }

    if (matchedFirs && activeFirFeatures) {
        return (
            <Source
                id="active-fir-layers"
                type="geojson"
                data={{
                    type: "FeatureCollection",
                    features: activeFirFeatures
                }}
            >
                <Layer {..._activeFirLayerStyle} />
            </Source>
        );
    }


    // if (matchedFIRS) {
    //     return (
    //         <Source
    //             id="active-fir-layers"
    //             type="vector"
    //             url="mapbox://mason-zh.cm00590z503li1tlkgyy8e5s3-5pv1b"
    //         >
    //             {(hoverFirCast && labelVisible) &&
    //                 <FirLabelPopup hoverFir={hoverFirCast}/>
    //             }
    //             {labelVisible && renderedMarkers}
    //         </Source>
    //     );
    // }
};

export default React.memo(FirLayer);
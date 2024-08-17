// The source layer to render FIR data.

import React, { useEffect } from "react";
import { VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import { activeFirLayerStyle } from "./firLayerMapStyle";
import useRenderFirLabelMarker from "../../../../hooks/useRenderFirLabelMarker";
import FirLabelPopup from "./FirLabelPopup";
import { useDispatch } from "react-redux";
import { addMessage, removeMessageByLocation } from "../../../../store";
import GeoJson from "geojson";
import useMatchedFirs, { MatchedFir } from "../../../../hooks/useMatchedFirs";

interface Controller {
    controllerInfo: VatsimControllers;
    labelVisible: boolean;
    geoJsonData: GeoJson.FeatureCollection;
}

const FirLayer = ({
    controllerInfo,
    labelVisible,
    geoJsonData
}: Controller) => {

    if (!geoJsonData || !controllerInfo) return null;

    const dispatch = useDispatch();
    console.log("Fir layer run");

    const {
        matchedFirs: matchedFIRS,
        isLoading,
        isError
    } = useMatchedFirs(controllerInfo, geoJsonData);

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
        const matchedFirIds = matchedFIRS.map(fir => fir.id);
        const layerStyle = activeFirLayerStyle(matchedFirIds, hoverFirCast);

        return (
            <Source
                id="active-fir-layers"
                type="vector"
                url="mapbox://mason-zh.clqudy2fp2ag61nogduw0ofwr-96of0"
            >
                <Layer {...layerStyle} />
                {(hoverFir && labelVisible) &&
                    <FirLabelPopup hoverFir={hoverFirCast}/>
                }
                {labelVisible && renderedMarkers}
            </Source>
        );
    }

    // if (geoJsonFeatures) {
    //     return (
    //         <Source type="geojson" data={geoJsonFeatures}>
    //             <Layer {...layerStyle} />
    //             <Layer {...boundariesLineStyle}/>
    //             {(hoverFir && firData && labelVisible && isFeatureCollection(hoverFirCast)) &&
    //                 <Source type="geojson" data={hoverFirCast}>
    //                     <Layer {...highlightLayer}/>
    //                     <FirLabelPopup hoverFir={hoverFirCast} firData={firData}/>
    //                 </Source>
    //             }
    //             {labelVisible && renderedMarkers}
    //         </Source>
    //     );
    // }
};

export default React.memo(FirLayer);
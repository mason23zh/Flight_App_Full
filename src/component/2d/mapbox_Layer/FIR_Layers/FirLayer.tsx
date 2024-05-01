// The source layer to render FIR data.

import React, { useEffect } from "react";
import { VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import useMatchedFirFeatures from "../../../../hooks/useMatchedFirFeatures";
import { layerStyle, boundariesLineStyle, highlightLayer } from "./firLayerMapStyle";
import useRenderFirLabelMarker from "../../../../hooks/useRenderFirLabelMarker";
import FirLabelPopup from "./FirLabelPopup";
import { useDispatch } from "react-redux";
import { addMessage, removeMessageByLocation } from "../../../../store";
import { isFeatureCollection } from "../util/helpers";
import GeoJson from "geojson";

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

    const dispatch = useDispatch();

    const {
        geoJsonFeatures,
        firData,
        isLoading,
        error
    } = useMatchedFirFeatures(
        controllerInfo,
        geoJsonData
    );
    useEffect(() => {
        if (isLoading) {
            dispatch(addMessage({
                location: "FIR",
                messageType: "LOADING",
                content: "Loading Fir layer..."
            }));
        }

        if (error) {
            dispatch(addMessage({
                location: "FIR",
                messageType: "ERROR",
                content: "Error loading Fir layer."
            }));
        }

        if (geoJsonFeatures && !error) {
            dispatch(removeMessageByLocation({ location: "FIR" }));
        }
    }, [isLoading, error, geoJsonFeatures, firData]);

    const {
        renderedMarkers,
        hoverFir
    } = useRenderFirLabelMarker(geoJsonFeatures);

    const hoverFirCast = hoverFir as GeoJson.FeatureCollection;

    if (geoJsonFeatures) {
        return (
            <Source type="geojson" data={geoJsonFeatures}>
                <Layer {...layerStyle} />
                <Layer {...boundariesLineStyle}/>
                {(hoverFir && firData && labelVisible && isFeatureCollection(hoverFirCast)) &&
                    <Source type="geojson" data={hoverFirCast}>
                        <Layer {...highlightLayer}/>
                        <FirLabelPopup hoverFir={hoverFirCast} firData={firData}/>
                    </Source>
                }
                {labelVisible && renderedMarkers}
            </Source>
        );
    }
};

export default React.memo(FirLayer);
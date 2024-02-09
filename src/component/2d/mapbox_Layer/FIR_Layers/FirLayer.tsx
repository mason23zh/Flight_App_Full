// The source layer to render FIR data.

import React, { useEffect } from "react";
import { AirportService, VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import useMatchedFirFeatures from "../../../../hooks/useMatchedFirFeatures";
import { layerStyle, boundariesLineStyle, highlightLayer } from "./firLayerMapStyle";
import useRenderFirLabelMarker from "../../../../hooks/useRenderFirLabelMarker";
import FirLabelPopup from "./FirLabelPopup";
import { useDispatch } from "react-redux";
import { addMessage, removeMessageByLocation } from "../../../../store";
import GeoJson from "geojson";

interface Controller {
    controllerInfo: VatsimControllers;
    labelVisible: boolean;
}


const FirLayer = ({
    controllerInfo,
    labelVisible
}: Controller) => {

    const dispatch = useDispatch();


    const {
        geoJsonFeatures,
        firData,
        isLoading,
        error
    } = useMatchedFirFeatures(
        controllerInfo,
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

    const isFeatureCollection = ( //type guard
        feature: GeoJson.FeatureCollection | AirportService
    ): feature is GeoJson.FeatureCollection => {
        return "type" in feature && feature["type"] === "FeatureCollection";
    };

    if (geoJsonFeatures) {
        return (
            <Source type="geojson" data={geoJsonFeatures}>
                <Layer {...layerStyle} />
                <Layer {...boundariesLineStyle}/>
                {(hoverFir && firData && labelVisible && isFeatureCollection(hoverFir)) &&
                    <Source type="geojson" data={hoverFir}>
                        <Layer {...highlightLayer}/>
                        <FirLabelPopup hoverFir={hoverFir} firData={firData}/>
                    </Source>
                }
                {labelVisible && renderedMarkers}
            </Source>
        );
    }
};

export default React.memo(FirLayer);
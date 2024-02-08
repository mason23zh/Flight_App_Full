// The source layer to render FIR data.

import React, { useEffect } from "react";
import { VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import useMatchedFirFeatures from "../../../../hooks/useMatchedFirFeatures";
import { layerStyle, boundariesLineStyle, highlightLayer } from "./firLayerMapStyle";
import useRenderFirLabelMarker from "../../../../hooks/useRenderFirLabelMarker";
import FirLabelPopup from "./FirLabelPopup";
import { useDispatch } from "react-redux";
import { addMessage } from "../../../../store";

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
            dispatch(addMessage("Loading Fir layer..."));
        }

        if (error) {
            dispatch(addMessage("Error loading Fir layer."));
        }
    }, [isLoading, error, geoJsonFeatures]);

    const {
        renderedMarkers,
        hoverFir
    } = useRenderFirLabelMarker(geoJsonFeatures);

    // if (isLoading) {
    //     dispatch(addMessage("Loading Fir layer..."));
    //
    // }
    //
    // if (error) {
    //     dispatch(addMessage("Error loading Fir layer."));
    // }

    if (geoJsonFeatures) {
        return (
            <Source type="geojson" data={geoJsonFeatures}>
                <Layer {...layerStyle} />
                <Layer {...boundariesLineStyle}/>
                {(hoverFir && firData && labelVisible) &&
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
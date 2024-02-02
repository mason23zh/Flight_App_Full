// The source layer to render FIR data.

import React from "react";
import { VatsimControllers } from "../../../../types";
import { Layer, Source } from "react-map-gl";
import useMatchedFirFeatures from "../../../../hooks/useMatchedFirFeatures";
import { layerStyle, boundariesLineStyle, highlightLayer } from "./firLayerMapStyle";
import useRenderFirLabelMarker from "../../../../hooks/useRenderFirLabelMarker";
import FirLabelPopup from "./FirLabelPopup";

interface Controller {
    controllerInfo: VatsimControllers;
    labelVisible: boolean;
}

const FirLayer = ({
    controllerInfo,
    labelVisible
}: Controller) => {
    const {
        geoJsonFeatures,
        firData,
        isLoading,
        error
    } = useMatchedFirFeatures(
        controllerInfo,
    );

    const {
        renderedMarkers,
        hoverFir
    } = useRenderFirLabelMarker(geoJsonFeatures);


    if (isLoading) {
        return (
            <>
                Loading...
            </>
        );
    }

    if (error) {
        return (
            <>
                Error
            </>
        );
    }

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
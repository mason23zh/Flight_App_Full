import React, { useEffect } from "react";
import useMatchFssFeatures from "../../../../hooks/useMatchFssFeatures";
import { VatsimControllers } from "../../../../types";
import GeoJson from "geojson";
import { useDispatch } from "react-redux";
import { addMessage, removeMessageByLocation } from "../../../../store";
import { Layer, Source } from "react-map-gl";
import { layerStyle, boundariesLineStyle, highlightLayer } from "./fssLayerMapStyle";
import useRenderFssLabelMarker from "../../../../hooks/useRenderFssLabelMarker";
import FssLabelPopup from "./FssLabelPopup";
import { isFeatureCollection } from "../util/helpers";
import FirLabelPopup from "../FIR_Layers/FirLabelPopup";

interface Controller {
    controllerInfo: VatsimControllers;
    labelVisible: boolean;
    geoJsonData: GeoJson.FeatureCollection;
}

const FssLayer = ({
    controllerInfo,
    labelVisible,
    geoJsonData
}: Controller) => {
    const dispatch = useDispatch();

    const {
        geoJsonFeatures: fssGeoJsonFeatures,
        isLoading,
        error
    } = useMatchFssFeatures(
        controllerInfo,
        geoJsonData
    );

    useEffect(() => {
        if (isLoading) {
            dispatch(addMessage({
                location: "FSS",
                messageType: "LOADING",
                content: "Loading FSS layer..."
            }));
        }

        if (error) {
            dispatch(addMessage({
                location: "FSS",
                messageType: "ERROR",
                content: "Error loading FSS layer."
            }));
        }

        if (fssGeoJsonFeatures && !error) {
            dispatch(removeMessageByLocation({ location: "FSS" }));
        }

    }, [isLoading, error, fssGeoJsonFeatures]);

    const {
        renderedMarkers,
        hoverFss
    } = useRenderFssLabelMarker(fssGeoJsonFeatures);

    const hoverFssCast = hoverFss as GeoJson.FeatureCollection;
    console.log("hover fss cast:", hoverFssCast);

    if (fssGeoJsonFeatures) {
        // console.log("geojson features:", fssGeoJsonFeatures);
        return (
            <Source type="geojson" data={fssGeoJsonFeatures}>
                <Layer {...layerStyle} />
                <Layer {...boundariesLineStyle} />
                {(hoverFss && labelVisible && isFeatureCollection(hoverFssCast)) &&
                    <Source type="geojson" data={hoverFssCast}>
                        <Layer {...highlightLayer}/>
                        {/* <FssLabelPopup hoverFss={hoverFssCast}/> */}
                    </Source>
                }
                {renderedMarkers}
            </Source>
        );
    }
};

export default React.memo(FssLayer);
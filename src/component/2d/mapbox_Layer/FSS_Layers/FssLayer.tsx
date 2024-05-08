import React, { useEffect } from "react";
import useMatchFssFeatures from "../../../../hooks/useMatchFssFeatures";
import { VatsimControllers } from "../../../../types";
import GeoJson from "geojson";
import { useDispatch } from "react-redux";
import { addMessage, removeMessageByLocation } from "../../../../store";
import { Layer, Source } from "react-map-gl";
import { layerStyle, boundariesLineStyle, highlightLayer } from "./fssLayerMapStyle";
import useRenderFssLabelMarker from "../../../../hooks/useRenderFssLabelMarker";

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
        geoJsonFeatures,
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

        if (geoJsonFeatures && !error) {
            dispatch(removeMessageByLocation({ location: "FSS" }));
        }

    }, [isLoading, error, geoJsonFeatures]);

    const {
        renderedMarkers,
        hoverFss
    } = useRenderFssLabelMarker(geoJsonFeatures);

    if (geoJsonFeatures) {
        console.log("geojson features:", geoJsonFeatures);
        return (
            <Source type="geojson" data={geoJsonFeatures}>
                <Layer {...layerStyle} />
                <Layer {...boundariesLineStyle} />
                {renderedMarkers}
            </Source>
        );
    }
};

export default React.memo(FssLayer);
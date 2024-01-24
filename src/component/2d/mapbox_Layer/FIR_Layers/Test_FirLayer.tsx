import React from "react";
import { VatsimControllers } from "../../../../types";
import { Layer, Marker, Source } from "react-map-gl";
import useMatchedFirFeatures from "../../../../hooks/useMatchedFirFeatures";
import useFetchVatsimFirData from "../../../../hooks/useFetchVatsimFirData";
import { layerStyle, boundariesLineStyle } from "./firLayerMapStyle";
import useRenderFirLabelMarker from "../../../../hooks/useRenderFirLabelMarker";

interface Controller {
    controllerInfo: VatsimControllers;
}

const TestFirLayer = ({ controllerInfo }: Controller) => {
    const [firData, geoJsonData] = useFetchVatsimFirData();
    const geoJsonFeatures = useMatchedFirFeatures(controllerInfo, firData, geoJsonData);
    const { renderedMarkers } = useRenderFirLabelMarker(geoJsonFeatures);

    if (geoJsonData && controllerInfo) {
        console.log("Controller Info:", controllerInfo.fir);
        console.log("GeoJson Data:", geoJsonData);
    }

    return (
        <Source type="geojson" data={geoJsonFeatures}>
            <Layer {...layerStyle} />
            <Layer {...boundariesLineStyle}/>
            {renderedMarkers}
        </Source>
    );
};

export default TestFirLayer;
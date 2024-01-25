import React from "react";
import { VatsimControllers } from "../../../../types";
import { Layer, Popup, Source } from "react-map-gl";
import useMatchedFirFeatures from "../../../../hooks/useMatchedFirFeatures";
import useFetchVatsimFirData from "../../../../hooks/useFetchVatsimFirData";
import { layerStyle, boundariesLineStyle, highlightLayer } from "./firLayerMapStyle";
import useRenderFirLabelMarker from "../../../../hooks/useRenderFirLabelMarker";
import FirLabelPopup from "./FirLabelPopup";
import ControllerMarker from "../ControllerMarker";

interface Controller {
    controllerInfo: VatsimControllers;
}

const TestFirLayer = ({ controllerInfo }: Controller) => {
    const [firData, geoJsonData] = useFetchVatsimFirData();
    const geoJsonFeatures = useMatchedFirFeatures(controllerInfo, firData, geoJsonData);
    const {
        renderedMarkers,
        hoverFir
    } = useRenderFirLabelMarker(geoJsonFeatures);


    if (geoJsonData && controllerInfo) {
        console.log("Controller Info:", controllerInfo.fir);
        console.log("GeoJson Data:", geoJsonData);
    }

    return (
        <Source type="geojson" data={geoJsonFeatures}>
            <Layer {...layerStyle} />
            <Layer {...boundariesLineStyle}/>
            {(hoverFir && firData) &&
                <Source type="geojson" data={hoverFir}>
                    <Layer {...highlightLayer}/>
                    {console.log("Hover fir info feather:", hoverFir)}
                    {console.log("hove firdata:", firData[hoverFir.features[0].properties.id])}
                    <FirLabelPopup hoverFir={hoverFir} firData={firData}/>
                </Source>
            }
            {renderedMarkers}
        </Source>
    );
};

export default React.memo(TestFirLayer);
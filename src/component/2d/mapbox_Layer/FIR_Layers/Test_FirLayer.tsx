import React from "react";
import { VatsimControllers } from "../../../../types";
import { Layer, Popup, Source } from "react-map-gl";
import useMatchedFirFeatures from "../../../../hooks/useMatchedFirFeatures";
import useFetchVatsimFirData from "../../../../hooks/useFetchVatsimFirData";
import { layerStyle, boundariesLineStyle, highlightLayer } from "./firLayerMapStyle";
import useRenderFirLabelMarker from "../../../../hooks/useRenderFirLabelMarker";

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
                    <Popup
                        longitude={Number(hoverFir.features[0].properties.label_lon)}
                        latitude={Number(hoverFir.features[0].properties.label_lat)}
                        closeButton={false}
                        anchor="left"
                    >
                        <div className="bg-blue-400 grid-cols-1">
                            <div className="flex items-center gap-2">
                                <div className="text-lg font-bold text-gray-600">
                                    {hoverFir.features[0].properties.id}
                                </div>
                                <div className="text-lg text-black">
                                    {firData[hoverFir.features[0].properties.id].name}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div>
                                    {hoverFir.features[0].properties.callsign}
                                </div>
                                <div>
                                    {hoverFir.features[0].properties.name}
                                </div>
                                <div>
                                    {hoverFir.features[0].properties.frequency}
                                </div>
                            </div>
                        </div>
                    </Popup>
                </Source>
            }
            {renderedMarkers}
        </Source>
    );
};
// callsign name rating radio time

// {showPopup && (
//         <Popup
//                 longitude={Number(feature.properties.label_lon)}
//                 latitude={Number(feature.properties.label_lat)}
//                 anchor="bottom"
//                 onClose={() => setShowPopup(false)}
//         >
//             {feature.properties.id}
//         </Popup>
// )}

export default React.memo(TestFirLayer);
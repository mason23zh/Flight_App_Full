import { VatsimControllers } from "../types";
import FirLayer from "../component/2d/mapbox_Layer/FIR_Layers/FirLayer";
import FirBoundariesLineLayer from "../component/2d/mapbox_Layer/FIR_Layers/FirBoundariesLineLayer";
import FirTextLayer from "../component/2d/mapbox_Layer/FIR_Layers/FirTextLayer";
import React, { useMemo } from "react";
import FirBoundarySourceLayer from "../component/2d/mapbox_Layer/FIR_Layers/FirBoundarySourceLayer";
import MapboxTextSourceLayer from "../component/2d/mapbox_Layer/FIR_Layers/MapboxTextSourceLayer";


const useFirLayers = (controllerData: VatsimControllers, controllerError: Partial<Error>) => {
    const firLayers = useMemo(() =>
        <FirLayer controllerInfo={controllerData}/>,
    [controllerData]);

    const firBoundariesLine = useMemo(() =>
        <FirBoundariesLineLayer controllerInfo={controllerData}/>
    , [controllerData]);

    const firTextLayers = useMemo(() =>
        <FirTextLayer controllerInfo={controllerData}/>
    , [controllerData]);


    const layers = !controllerError &&
    <FirBoundarySourceLayer>
        {firLayers}
        {firBoundariesLine}
    </FirBoundarySourceLayer>;


    const text = !controllerError &&
    <MapboxTextSourceLayer>
        {firTextLayers}
    </MapboxTextSourceLayer>;


    return {
        firLayer: layers,
        firTextLayer: text
    };
};

export default useFirLayers;
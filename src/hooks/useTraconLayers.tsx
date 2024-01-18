import { VatsimControllers } from "../types";
import React, { useMemo } from "react";
import TraconBoundariesLineLayer from "../component/2d/mapbox_Layer/Tracon_Layers/TraconBoundariesLineLayer";
import TraconLayer from "../component/2d/mapbox_Layer/Tracon_Layers/TraconLayer";
import MapboxTraconSourceLayer from "../component/2d/mapbox_Layer/Tracon_Layers/MapboxTraconSourceLayer";

const useTraconLayers = (controllerData: VatsimControllers, controllerError: Partial<Error>) => {
    const traconBoundariesLine = useMemo(() => {
        return <TraconBoundariesLineLayer controllerInfo={controllerData}/>;
    }, [controllerData]);

    const traconLayers = useMemo(() => {
        return <TraconLayer controllerInfo={controllerData}/>;
    }, [controllerData]);

    const layers = !controllerError &&
    <MapboxTraconSourceLayer>
        {traconLayers}
        {traconBoundariesLine}
    </MapboxTraconSourceLayer>;


    return {
        traconLayers: layers
    };
};

export default useTraconLayers;
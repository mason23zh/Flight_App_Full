/*
* This hook controls the visibility for layer in globe projection
* These layers are:
* - VatsimTrafficLayer
* - GlobeControllerIconLayer
* - GlobeTraconIconLayer
* - GlobeFirIconLayer
* */

import { useEffect } from "react";
import { MapRef } from "react-map-gl";

const useGlobeLayerVisibility = (
    mapRef: MapRef | null,
    layerId: string,
    isVisible: boolean
) => {
    useEffect(() => {
        if (!mapRef?.getMap) return;
        const map = mapRef.getMap();

        const applyVisibility = () => {
            if (map.getLayer(layerId)) {
                map.setLayoutProperty(layerId, "visibility", isVisible ? "visible" : "none");
            }
        };

        applyVisibility();

        const restoreVisibility = () => {
            applyVisibility();
        };

        map.on("styledata", restoreVisibility);

        return () => {
            map.off("styledata", restoreVisibility);
        };
    }, [mapRef, layerId, isVisible]);
};

export default useGlobeLayerVisibility;
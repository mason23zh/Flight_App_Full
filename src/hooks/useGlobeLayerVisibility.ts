/*
 * This hook controls the visibility for layer in globe projection
 * These layers are:
 * - VatsimTrafficLayer
 * - GlobeControllerIconLayer
 * - GlobeTraconIconLayer
 * - GlobeFirIconLayer
 * */

import { useEffect, useRef } from "react";
import { MapRef } from "react-map-gl";

const useGlobeLayerVisibility = (mapRef: MapRef | null, layerId: string, isVisible: boolean) => {
    const previousVisibility = useRef(isVisible);
    const isFirstLoaded = useRef(true);

    useEffect(() => {
        if (!mapRef?.getMap || previousVisibility.current === isVisible) return;
        const map = mapRef.getMap();

        const applyVisibility = () => {
            if (map.getLayer(layerId)) {
                map.setLayoutProperty(layerId, "visibility", isVisible ? "visible" : "none");
                return true;
            }
            return false;
        };

        if (!isFirstLoaded.current && previousVisibility.current === isVisible) return;

        const handleSourceData = () => {
            if (applyVisibility()) {
                map.off("sourcedata", handleSourceData);
                isFirstLoaded.current = false;
            }
        };

        if (!applyVisibility()) {
            map.on("sourcedata", handleSourceData);
        } else {
            isFirstLoaded.current = false;
        }

        previousVisibility.current = isVisible;

        return () => {
            map.off("sourcedata", handleSourceData);
        };

        // applyVisibility();

        // const restoreVisibility = () => {
        //     applyVisibility();
        // };

        // map.on("sourcedata", restoreVisibility);

        // previousVisibility.current = isVisible;

        // return () => {
        //     map.off("sourcedata", restoreVisibility);
        // };
    }, [mapRef, layerId, isVisible]);
};

export default useGlobeLayerVisibility;

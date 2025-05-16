/**
 * The useMapIsReady hook will be called in the children of the Map component
 * The purpose of this hook is to act like gate to control if other layer can be loaded
 * If map is not ready, other layer should not be loaded.
 * **/
import { useMap } from "react-map-gl";
import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

export const useMapIsReady = (map: mapboxgl.Map | null) => {
    const { current: mapRef } = useMap();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const handleLoad = () => setReady(true);

        if (map.isStyleLoaded()) {
            setReady(true);
        } else {
            map.on("style.load", handleLoad);
        }

        return () => {
            map.off("style.load", handleLoad);
        };
    }, [mapRef]);

    return ready;
};

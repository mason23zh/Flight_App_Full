import { useMap } from "react-map-gl";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect } from "react";

const useMapTerrain = (terrainEnable: boolean) => {

    const { current: mapRef } = useMap();

    useEffect(() => {

        const map = mapRef.getMap();
        if (!map) return;

        const setupTerrain = () => {
            if (!map.isStyleLoaded()) {
                setTimeout(setupTerrain, 200);
                return;
            }

            if (terrainEnable) {
                if (!map.getSource("mapbox-dem")) {
                    map.addSource("mapbox-dem", {
                        type: "raster-dem",
                        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
                        tileSize: 512,
                        maxzoom: 14,
                    });
                    map.setTerrain({
                        source: "mapbox-dem",
                        exaggeration: 1.5,
                    });
                }
            } else {
                if (map.getTerrain()) {
                    map.setTerrain(null);
                }
                if (map.getSource("mapbox-dem")) {
                    map.removeSource("mapbox-dem");
                }
                map.setPitch(0);
                map.setBearing(0);
            }
        };

        if (map.isStyleLoaded()) {
            setupTerrain();
        }

        const reapply = () => setupTerrain();
        mapRef.on("style.load", reapply);


        return () => {
            map.setTerrain(null);
            if (map.getSource("mapbox-dem")) {
                try {
                    map.removeSource("mapbox-dem");
                } catch (e) {
                    console.warn("Error removing 'mapbox-dem':", e);
                }
            }
            mapRef.off("style.load", reapply);
        };
    }, [mapRef, terrainEnable]);
};

export default useMapTerrain;
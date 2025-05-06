import React, { useEffect } from "react";
import { useMap } from "react-map-gl";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const TerrainLayer = () => {
    const { current: mapRef } = useMap();
    const { terrainEnable } = useSelector((state: RootState) => state.vatsimMapVisible);

    useEffect(() => {
        console.log("terrain enable?::", terrainEnable);

        const map = mapRef.getMap();
        if (!map) return;

        const setupTerrain = () => {
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

        // Attach listener for future style changes
        map.on("style.load", setupTerrain);

        // If style already loaded, apply immediately
        if (map.isStyleLoaded()) {
            setupTerrain();
        }

        return () => {
            map.setTerrain(null);
            if (map.getSource("mapbox-dem")) {
                try {
                    map.removeSource("mapbox-dem");
                } catch (e) {
                    console.warn("Error removing 'mapbox-dem':", e);
                }
            }
            map.off("style.load", setupTerrain);
        };
    }, [mapRef, terrainEnable]);


    return (
        <></>
    );
};

export default React.memo(TerrainLayer);
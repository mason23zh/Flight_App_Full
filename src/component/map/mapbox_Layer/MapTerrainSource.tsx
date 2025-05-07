import { Source, useMap } from "react-map-gl";
import {
    RootState,
} from "../../../store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
const MapTerrainSource = () => {
    const { terrainEnable } = useSelector((state: RootState) => state.vatsimMapVisible);
    const { current: mapRef } = useMap();

    useEffect(() => {
        const map = mapRef?.getMap();
        if (!map) return;

        if (!terrainEnable) {
            map.setPitch(0);
            map.setBearing(0);
        }
    }, [terrainEnable]);

    if (!terrainEnable) return null;

    return (
        <Source
            id="mapbox-dem"
            type="raster-dem"
            url="mapbox://mapbox.mapbox-terrain-dem-v1"
            tileSize={512}
            maxzoom={14}
        />
    );
};

export default MapTerrainSource;
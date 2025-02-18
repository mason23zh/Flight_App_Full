import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { GeoJSONSource, Layer, Source, useMap } from "react-map-gl";
import { MatchedFir } from "../../../../hooks/useMatchedFirs";
import generateFirIcon from "../../mapbox_Layer/util/generateFirIcon";
import useGlobeLayerVisibility from "../../../../hooks/useGlobeLayerVisibility";
import { GLOBE_FIR_ICON_LAYER_ID } from "../layerSourceName";
import mapboxgl from "mapbox-gl";


const GlobeFirIconLayer = () => {
    const { current: mapRef } = useMap();
    const {
        matchedFirs,
        isError: errorMatchedFirs
    } = useSelector((state: RootState) => state.matchedFirs);
    const { allAtcLayerVisible } = useSelector((state: RootState) => state.vatsimMapVisible);
    const imagePrefix = "fir-icon-";
    const loadedIconRef = useRef(new Set<string>());


    //load FIR Icons
    const loadFirIcons = (map: mapboxgl.Map) => {
        matchedFirs.forEach((feature: MatchedFir) => {
            const iconId = `${imagePrefix}${feature.firInfo.uniqueId}`;

            const isFss = feature.isInFss || feature.firInfo.isFss;
            const iconUrl = generateFirIcon(feature.firInfo.firBoundary, isFss);

            if (!map.hasImage(iconId) && !loadedIconRef.current.has(iconId)) {
                const image = new Image();
                image.onload = () => {
                    if (!map.hasImage(iconId)) {
                        map.addImage(iconId, image, { sdf: false });
                        loadedIconRef.current.add(iconId);
                    }
                };
                image.onerror = () => {
                    console.error("Error loading FIR icons.");
                };
                image.src = iconUrl;
            }
        });
    };

    const removeFirIcons = (map: mapboxgl.Map) => {
        matchedFirs.forEach((feature: MatchedFir) => {
            const iconId = `${imagePrefix}${feature.firInfo.uniqueId}`;
            if (map.hasImage(iconId)) {
                map.removeImage(iconId);
                loadedIconRef.current.delete(iconId);
            }
        });
    };

    const updateGeoJson = (map: mapboxgl.Map, firData: MatchedFir[]) => {
        const newGeoJson: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: firData.map((feature) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [
                        Number(feature.firInfo?.entries[0]?.label_lon),
                        Number(feature.firInfo?.entries[0]?.label_lat)
                    ],
                },
                properties: {
                    uniqueFirId: feature.firInfo.uniqueId,
                    controllers: JSON.stringify(feature.controllers),
                    firInfo: JSON.stringify(feature.firInfo),
                    ...feature,
                },
            }))
        };

        let source = map.getSource("fir-icon-layer-source-globe") as GeoJSONSource;

        if (!source) {
            map.addSource("fir-icon-layer-source-globe", {
                type: "geojson",
                data: newGeoJson
            });

            map.addLayer({
                id: "fir-icon-globe-layer",
                type: "symbol",
                source: "fir-icon-layer-source-globe",
                layout: {
                    "icon-image": ["concat", imagePrefix, ["get", "uniqueFirId"]],
                    "icon-size": 0.4,
                    "icon-allow-overlap": true,
                },
            });

            source = map.getSource("fir-icon-layer-source-globe") as GeoJSONSource;
        }

        if (source) {
            source.setData(newGeoJson);
        }
    };

    useEffect(() => {
        if (!mapRef?.getMap || errorMatchedFirs || !matchedFirs) return;
        const map = mapRef.getMap();

        loadFirIcons(map);
        updateGeoJson(map, matchedFirs);

        return () => {
            removeFirIcons(map);
        };
    }, [matchedFirs, errorMatchedFirs, mapRef]);

    useEffect(() => {
        if (!mapRef?.getMap) return;
        const map = mapRef.getMap();

        const restoreFirs = () => {
            loadedIconRef.current.clear();
            loadFirIcons(map);
            updateGeoJson(map, matchedFirs);
        };

        map.on("style.load", restoreFirs);

        return () => {
            map.off("style.load", restoreFirs);
        };
    }, [mapRef, matchedFirs]);


    useGlobeLayerVisibility(mapRef, GLOBE_FIR_ICON_LAYER_ID, allAtcLayerVisible);

    return (
        <Source
            id="fir-icon-layer-source-globe"
            type="geojson"
            // data={geoJsonData}
            data={{
                type: "FeatureCollection",
                features: []
            }}
        >
            <Layer
                id="fir-icon-globe-layer"
                // beforeId="tracon-icon-globe-layer"
                type="symbol"
                layout={{
                    "icon-image": ["concat", imagePrefix, ["get", "uniqueFirId"]],
                    "icon-size": 0.4,
                    "icon-allow-overlap": true,
                }}
            />
        </Source>
    );
};

export default GlobeFirIconLayer;
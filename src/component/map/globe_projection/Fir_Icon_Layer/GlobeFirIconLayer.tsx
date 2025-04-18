import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { GeoJSONSource, Layer, Source, useMap } from "react-map-gl";
import { MatchedFir } from "../../../../hooks/useMatchedFirs";
import generateFirIcon from "../../mapbox_Layer/util/generateFirIcon";
import useGlobeLayerVisibility from "../../../../hooks/useGlobeLayerVisibility";
import {
    GLOBE_CONTROLLER_ICON_LAYER_ID,
    GLOBE_FIR_ICON_LAYER_ID,
    GLOBE_FIR_ICON_SOURCE_ID,
    GLOBE_TRACON_ICON_LAYER_ID,
} from "../layerSourceName";
import mapboxgl from "mapbox-gl";

interface Props {
    matchedFirs: MatchedFir[];
    errorMatchedFirs: boolean;
}

const GlobeFirIconLayer = ({ matchedFirs, errorMatchedFirs }: Props) => {
    const { current: mapRef } = useMap();

    const { allAtcLayerVisible, mapStyles } = useSelector((state: RootState) => state.vatsimMapVisible);
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
                        Number(feature.firInfo?.entries[0]?.label_lat),
                    ],
                },
                properties: {
                    uniqueFirId: feature.firInfo.uniqueId,
                    controllers: JSON.stringify(feature.controllers),
                    firInfo: JSON.stringify(feature.firInfo),
                    ...feature,
                },
            })),
        };

        let source = map.getSource(GLOBE_FIR_ICON_SOURCE_ID) as GeoJSONSource;

        if (!source) {
            map.addSource(GLOBE_FIR_ICON_SOURCE_ID, {
                type: "geojson",
                data: newGeoJson,
            });

            map.addLayer({
                id: GLOBE_FIR_ICON_LAYER_ID,
                type: "symbol",
                source: GLOBE_FIR_ICON_SOURCE_ID,
                layout: {
                    "icon-image": ["concat", imagePrefix, ["get", "uniqueFirId"]],
                    "icon-size": 0.4,
                    "icon-allow-overlap": true,
                    visibility: allAtcLayerVisible ? "visible" : "none",
                },
            });

            source = map.getSource(GLOBE_FIR_ICON_SOURCE_ID) as GeoJSONSource;
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

    // adjusting the layer order, make sure FIR icon layer always stays on top
    useEffect(() => {
        if (!mapRef?.getMap) return;
        const map = mapRef.getMap();

        const moveLayerOnStyleChange = () => {
            if (
                map.getLayer(GLOBE_FIR_ICON_LAYER_ID) &&
                map.getLayer(GLOBE_TRACON_ICON_LAYER_ID) &&
                map.getLayer(GLOBE_CONTROLLER_ICON_LAYER_ID)
            ) {
                map.moveLayer(GLOBE_TRACON_ICON_LAYER_ID, GLOBE_FIR_ICON_LAYER_ID);
                map.moveLayer(GLOBE_CONTROLLER_ICON_LAYER_ID, GLOBE_FIR_ICON_LAYER_ID);
            }
        };

        map.on("style.load", moveLayerOnStyleChange);
        // map.on("styledata", moveLayerOnStyleChange);

        return () => {
            map.off("style.load", moveLayerOnStyleChange);
            // map.off("styledata", moveLayerOnStyleChange);
        };
    }, [mapRef, mapStyles]);

    // useGlobeLayerVisibility(mapRef, GLOBE_FIR_ICON_LAYER_ID, allAtcLayerVisible);

    console.log("allAtcLayerVisible", allAtcLayerVisible);
    return (
        <Source
            id={GLOBE_FIR_ICON_SOURCE_ID}
            type="geojson"
            // data={geoJsonData}
            data={{
                type: "FeatureCollection",
                features: [],
            }}
        >
            <Layer
                id={GLOBE_FIR_ICON_LAYER_ID}
                type="symbol"
                layout={{
                    "icon-image": ["concat", imagePrefix, ["get", "uniqueFirId"]],
                    "icon-size": 0.4,
                    "icon-allow-overlap": true,
                    visibility: allAtcLayerVisible ? "visible" : "none",
                }}
            />
        </Source>
    );
};

export default React.memo(GlobeFirIconLayer);

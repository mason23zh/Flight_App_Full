import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { GeoJSONSource, Layer, Source, useMap } from "react-map-gl";
import { FallbackTracon, MatchedTracon } from "../../../../hooks/useMatchTracon";
import generateTraconIcon from "../../mapbox_Layer/util/generateTraconIcon";
import { GLOBE_TRACON_ICON_LAYER_ID, GLOBE_TRACON_ICON_SOURCE_ID } from "../layerSourceName";
import mapboxgl from "mapbox-gl";
import useGlobeLayerVisibility from "../../../../hooks/useGlobeLayerVisibility";

interface Props {
    matchedTracons: MatchedTracon[];
    matchedFallbackTracons: FallbackTracon[];
    isTraconLoading: boolean;
    isTraconError: boolean;
}

interface TraconFeature {
    uniqueId: string;
    coordinates: number[];
    iconId: string;
    isFallback: boolean;
    originalData: MatchedTracon | FallbackTracon;
}

const GlobeTraconIconLayer_Test = ({
    matchedTracons,
    matchedFallbackTracons,
    isTraconError
}: Props) => {
    const { current: mapRef } = useMap();
    const previousTraconsRef = useRef<TraconFeature[]>([]);
    const loadedIconsRef = useRef(new Set<string>());
    const imagePrefix = "tracon-icon-";
    const iconCache = useRef(new Map<string, HTMLImageElement>());

    const {
        mapStyles,
        allAtcLayerVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const normalizeTracons = useCallback(
        (matchedTracons: MatchedTracon[], fallbackTracons: FallbackTracon[]): TraconFeature[] => {
            const matchedFeatures: TraconFeature[] = matchedTracons.map((tracon) => ({
                uniqueId: tracon.traconInfo.uniqueId,
                coordinates: tracon.traconInfo.coordinates,
                iconId: `${imagePrefix}${tracon.traconInfo.uniqueId}`,
                isFallback: false,
                originalData: tracon,
            }));

            const fallbackFeatures: TraconFeature[] = fallbackTracons?.map((tracon) => ({
                uniqueId: tracon.controllers[0].cid.toString(),
                coordinates: tracon.edgeCoordinates,
                iconId: `${imagePrefix}${tracon.controllers[0].cid}`,
                isFallback: true,
                originalData: {
                    ...tracon,
                    traconInfo: {
                        coordinates: tracon.edgeCoordinates,
                        name: tracon.controllers[0].airport.name + " " + "APP/DEP",
                    },
                },
            }));

            return [...matchedFeatures, ...fallbackFeatures];
        },
        [],
    );

    const diffTracons = useCallback((newData: TraconFeature[], oldData: TraconFeature[]) => {
        const toKeyedMap = (data: TraconFeature[]) => new Map(data.map((tracon) => [tracon.uniqueId, tracon]));

        const newMap = toKeyedMap(newData);
        const oldMap = toKeyedMap(oldData);

        const added: TraconFeature[] = [];
        const updated: TraconFeature[] = [];
        const removed: TraconFeature[] = [];

        for (const [key, newTracon] of newMap) {
            if (!oldMap.has(key)) {
                added.push(newTracon);
            } else {
                const oldTracon = oldMap.get(key);
                if (
                    newTracon.originalData.controllers[0].callsign !== oldTracon?.originalData.controllers[0].callsign
                ) {
                    updated.push(newTracon);
                }
            }
        }

        for (const [key, oldTracon] of oldMap) {
            if (!newMap.has(key)) {
                removed.push(oldTracon);
            }
        }

        return {
            added,
            updated,
            removed
        };
    }, []);

    const loadIcons = useCallback((map: mapboxgl.Map, added: TraconFeature[], updated: TraconFeature[]) => {
        const iconsToLoad = [...added, ...updated].filter((tracon) => !loadedIconsRef.current.has(tracon.iconId));

        if (iconsToLoad.length === 0) return;

        const processBatch = (startIndex: number) => {
            const batchSize = 5;
            const endIndex = Math.min(startIndex + batchSize, iconsToLoad.length);

            const currentBatch = iconsToLoad.slice(startIndex, endIndex);

            currentBatch.forEach((tracon) => {
                const callsign = tracon.originalData.controllers[0].callsign.slice(0, -4);

                // Check cache first
                const cachedImage = iconCache.current.get(tracon.iconId);
                if (cachedImage) {
                    if (!map.hasImage(tracon.iconId)) {
                        map.addImage(tracon.iconId, cachedImage, { sdf: false });
                        loadedIconsRef.current.add(tracon.iconId);
                    }
                    return;
                }

                // Generate new icon
                const image = new Image();
                image.onload = () => {
                    requestAnimationFrame(() => {
                        if (!map.hasImage(tracon.iconId)) {
                            map.addImage(tracon.iconId, image, { sdf: false });
                            loadedIconsRef.current.add(tracon.iconId);
                            iconCache.current.set(tracon.iconId, image);
                        }
                    });
                };
                image.src = generateTraconIcon(callsign);
            });

            if (endIndex < iconsToLoad.length) {
                setTimeout(() => processBatch(endIndex), 16);
            }
        };

        processBatch(0);
    }, []);

    const removeIcons = useCallback((map: mapboxgl.Map, removed: TraconFeature[]) => {
        removed.forEach((tracon) => {
            if (map.hasImage(tracon.iconId)) {
                map.removeImage(tracon.iconId);
                loadedIconsRef.current.delete(tracon.iconId);
                iconCache.current.delete(tracon.iconId);
            }
        });
    }, []);

    const updateGeoJson = useCallback((map: mapboxgl.Map, combinedData: TraconFeature[]) => {
        const newGeoJson: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: combinedData.map((tracon) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: tracon.coordinates,
                },
                properties: {
                    uniqueId: tracon.uniqueId,
                    isFallback: tracon.isFallback,
                    ...tracon.originalData,
                },
            })),
        };

        let source = map.getSource(GLOBE_TRACON_ICON_SOURCE_ID) as GeoJSONSource;

        if (!source) {
            map.addSource(GLOBE_TRACON_ICON_SOURCE_ID, {
                type: "geojson",
                data: newGeoJson,
            });

            map.addLayer({
                id: GLOBE_TRACON_ICON_LAYER_ID,
                type: "symbol",
                source: GLOBE_TRACON_ICON_SOURCE_ID,
                layout: {
                    "icon-image": ["concat", imagePrefix, ["get", "uniqueId"]],
                    "icon-size": 0.4,
                    "icon-allow-overlap": true,
                },
            });

            source = map.getSource(GLOBE_TRACON_ICON_SOURCE_ID) as GeoJSONSource;
        }

        if (source) {
            source.setData(newGeoJson);
        }
    }, []);

    // first useEffect to load everything
    useEffect(() => {
        if (!mapRef?.getMap || isTraconError) return;
        const map = mapRef.getMap();

        const normlizeData = normalizeTracons(matchedTracons, matchedFallbackTracons);
        const {
            added,
            updated,
            removed
        } = diffTracons(normlizeData, previousTraconsRef.current);
        loadIcons(map, added, updated);
        removeIcons(map, removed);
        updateGeoJson(map, normlizeData);

        previousTraconsRef.current = normlizeData;
    }, [
        mapRef,
        matchedTracons,
        matchedFallbackTracons,
        normalizeTracons,
        diffTracons,
        loadIcons,
        removeIcons,
        updateGeoJson,
    ]);

    // Handle style changes
    useEffect(() => {
        if (!mapRef?.getMap) return;
        const map = mapRef.getMap();

        const restoreOnStyleChange = () => {
            loadedIconsRef.current.clear();
            previousTraconsRef.current = [];

            const normlizeData = normalizeTracons(matchedTracons, matchedFallbackTracons);
            const {
                added,
                updated,
                removed
            } = diffTracons(normlizeData, []);
            // console.log("restore on style change added:", added.length);
            // console.log("restore on style change updated:", updated.length);
            // console.log("restore on style change removed:", removed.length);
            loadIcons(map, added, updated);
            removeIcons(map, removed);
            updateGeoJson(map, normlizeData);
        };

        map.on("style.load", restoreOnStyleChange);
        return () => {
            map.off("style.load", restoreOnStyleChange);
        };
    }, [mapRef, loadIcons, updateGeoJson, mapStyles]);

    // useglobelayervisibility(mapref, globe_tracon_icon_layer_id, allatclayervisible);

    return (
        <Source
            id={GLOBE_TRACON_ICON_SOURCE_ID}
            type="geojson"
            data={{
                type: "FeatureCollection",
                features: [],
            }}
        >
            <Layer
                id={GLOBE_TRACON_ICON_LAYER_ID}
                type="symbol"
                layout={{
                    "icon-image": ["concat", imagePrefix, ["get", "uniqueId"]],
                    "icon-size": 0.4,
                    "icon-allow-overlap": true,
                    visibility: allAtcLayerVisible ? "visible" : "none",
                }}
            />
        </Source>
    );
};

export default React.memo(GlobeTraconIconLayer_Test);

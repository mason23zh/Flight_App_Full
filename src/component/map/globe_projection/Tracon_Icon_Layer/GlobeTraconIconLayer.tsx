import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { GeoJSONSource, Layer, Source, useMap } from "react-map-gl";
import { FallbackTracon, MatchedTracon } from "../../../../hooks/useMatchTracon";
import generateTraconIcon from "../../mapbox_Layer/util/generateTraconIcon";
import {
    GLOBE_CONTROLLER_ICON_LAYER_ID,
    GLOBE_TRACON_ICON_LAYER_ID,
    GLOBE_TRACON_ICON_SOURCE_ID,
} from "../layerSourceName";
import mapboxgl from "mapbox-gl";
import useGlobeLayerVisibility from "../../../../hooks/useGlobeLayerVisibility";

interface Props {
    matchedTracons: MatchedTracon[],
    matchedFallbackTracons: FallbackTracon[],
    isTraconLoading: boolean,
    isTraconError: boolean,
}

interface TraconFeature {
    uniqueId: string;
    coordinates: number[];
    iconId: string;
    isFallback: boolean;
    originalData: MatchedTracon | FallbackTracon;
}

//TODO: Optimize the image loading
const GlobeTraconIconLayer = ({
    matchedTracons,
    matchedFallbackTracons,
    isTraconLoading,
    isTraconError
}: Props) => {
    const { current: mapRef } = useMap();
    const previousTraconsRef = useRef<TraconFeature[]>([]);
    const loadedIconsRef = useRef(new Set<string>());
    const imagePrefix = "tracon-icon-";

    const {
        mapStyles,
        allAtcLayerVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const normalizeTracons = (
        matchedTracons: MatchedTracon[],
        fallbackTracons: FallbackTracon[]
    ): TraconFeature[] => {
        const matchedFeatures: TraconFeature[] = matchedTracons.map((tracon) => ({
            uniqueId: tracon.traconInfo.uniqueId,
            coordinates: tracon.traconInfo.coordinates,
            iconId: `${imagePrefix}${tracon.traconInfo.uniqueId}`,
            isFallback: false,
            originalData: tracon
        }));

        const fallbackFeatures: TraconFeature[] = fallbackTracons.map((tracon) => ({
            uniqueId: tracon.controllers[0].cid.toString(),
            coordinates: tracon.edgeCoordinates,
            iconId: `${imagePrefix}${tracon.controllers[0].cid}`,
            isFallback: true,
            originalData: {
                ...tracon,
                traconInfo: {
                    coordinates: tracon.edgeCoordinates,
                    name: tracon.controllers[0].airport.name + " " + "APP/DEP",
                }
            }
        }));

        return [...matchedFeatures, ...fallbackFeatures];
    };


    const diffTracons = (newData: TraconFeature[], oldData: TraconFeature[]) => {
        const toKeyedMap = (data: TraconFeature[]) =>
            new Map(data.map(tracon => [tracon.uniqueId, tracon]));

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
                //only need to compare the controller callsign since icon is generated based on the callsign
                if (newTracon.originalData.controllers[0].callsign !== oldTracon?.originalData.controllers[0].callsign) {
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
    };

    //function to load icons
    const loadIcons = useCallback((map: mapboxgl.Map, added: TraconFeature[], updated: TraconFeature[]) => {
        [...added, ...updated].forEach((tracon) => {
            if (loadedIconsRef.current.has(tracon.iconId)) return;

            const iconUrl = generateTraconIcon(tracon.originalData.controllers[0].callsign.slice(0, -4));
            const image = new Image();
            image.onload = () => {
                if (!map.hasImage(tracon.iconId)) {
                    map.addImage(tracon.iconId, image, { sdf: false });
                    loadedIconsRef.current.add(tracon.iconId);
                }
            };
            image.src = iconUrl;
        });
    }, []);

    const removeIcons = useCallback((map: mapboxgl.Map, removed: TraconFeature[]) => {
        removed.forEach((tracon) => {
            if (map.hasImage(tracon.iconId)) {
                map.removeImage(tracon.iconId);
                loadedIconsRef.current.delete(tracon.iconId);
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
                    coordinates: tracon.coordinates
                },
                properties: {
                    uniqueId: tracon.uniqueId,
                    isFallback: tracon.isFallback,
                    ...tracon.originalData
                }
            }))
        };

        let source = map.getSource(GLOBE_TRACON_ICON_SOURCE_ID) as GeoJSONSource;

        if (!source) {
            map.addSource(GLOBE_TRACON_ICON_SOURCE_ID, {
                type: "geojson",
                data: newGeoJson
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

    useEffect(() => {
        if (!mapRef?.getMap || isTraconLoading || isTraconError) return;
        const map = mapRef.getMap();

        const combineData = normalizeTracons(matchedTracons, matchedFallbackTracons);
        const {
            added,
            updated,
            removed
        } = diffTracons(combineData, previousTraconsRef.current);

        loadIcons(map, added, updated);
        removeIcons(map, removed);
        updateGeoJson(map, combineData);

        previousTraconsRef.current = combineData;

        // return () => {
        //     removeIcons(map, removed);
        // };
    }, [matchedTracons, matchedFallbackTracons, normalizeTracons, diffTracons, loadIcons, removeIcons, updateGeoJson]);

    //restore after style change
    useEffect(() => {
        if (!mapRef?.getMap) return;
        const map = mapRef.getMap();

        const restoreTracons = () => {
            console.log("Map style changed! Restoring Tracon icons...");
            //clear loaded icons
            loadedIconsRef.current.clear();
            previousTraconsRef.current = [];

            const combinedData = normalizeTracons(matchedTracons, matchedFallbackTracons);

            const {
                added,
                removed
            } = diffTracons(combinedData, []);
            // reload all icons
            loadIcons(map, added, []);
            removeIcons(map, removed);
            updateGeoJson(map, added);
            // loadIcons(map, previousTraconsRef.current, []);
            // updateGeoJson(map, previousTraconsRef.current);
        };

        map.on("style.load", restoreTracons);

        return () => {
            map.off("style.load", restoreTracons);
        };
    }, [mapRef, normalizeTracons, diffTracons, loadIcons, removeIcons, updateGeoJson, mapStyles]);

    console.log("Globe tracon icon layer run.");

    // adjust the layer order
    useEffect(() => {
        if (!mapRef?.getMap) return;
        const map = mapRef.getMap();

        const moveLayerOnStyleChange = () => {
            if (map.getLayer(GLOBE_TRACON_ICON_LAYER_ID) && map.getLayer(GLOBE_CONTROLLER_ICON_LAYER_ID)) {
                map.moveLayer(GLOBE_CONTROLLER_ICON_LAYER_ID, GLOBE_TRACON_ICON_LAYER_ID);
            }
        };

        map.on("style.load", moveLayerOnStyleChange);
        map.on("styledata", moveLayerOnStyleChange);

        return () => {
            map.off("style.load", moveLayerOnStyleChange);
            map.off("styledata", moveLayerOnStyleChange);
        };
    }, [mapRef, mapStyles]);

    //Visibility control
    useGlobeLayerVisibility(mapRef, GLOBE_TRACON_ICON_LAYER_ID, allAtcLayerVisible);


    return (
        <Source
            id={GLOBE_TRACON_ICON_SOURCE_ID}
            type="geojson"
            // data={geoJsonData}
            data={{
                type: "FeatureCollection",
                features: []
            }}
        >
            <Layer
                id={GLOBE_TRACON_ICON_LAYER_ID}
                // beforeId="controller-icon-globe-layer"
                type="symbol"
                layout={{
                    "icon-image": ["concat", imagePrefix, ["get", "uniqueId"]],
                    "icon-size": 0.4,
                    "icon-allow-overlap": true,
                }}
            />
        </Source>
    );
};

export default React.memo(GlobeTraconIconLayer);
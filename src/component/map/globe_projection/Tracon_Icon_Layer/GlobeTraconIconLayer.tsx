import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { GeoJSONSource, Layer, Source, useMap } from "react-map-gl";
import { FallbackTracon, MatchedTracon } from "../../../../hooks/useMatchTracon";
import generateTraconIcon from "../../mapbox_Layer/util/generateTraconIcon";

interface TraconFeature {
    uniqueId: string;
    coordinates: number[];
    iconId: string;
    isFallback: boolean;
    originalData: MatchedTracon | FallbackTracon;
}

//TODO: Optimize the image loading
const GlobeTraconIconLayer = () => {
    const { current: mapRef } = useMap();
    const previousTraconsRef = useRef<TraconFeature[]>([]);
    const imagePrefix = "tracon-icon-";
    const {
        matchedFallbackTracons,
        matchedTracons,
        isLoading: isTraconLoading,
        isError: isTraconError
    } = useSelector((state: RootState) => state.matchedTracons);

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


    useEffect(() => {
        if (!mapRef?.getMap || isTraconLoading || isTraconError) return;
        const map = mapRef.getMap();

        //combine both fallback and matchedTracon to a normalized structure
        const combineData = normalizeTracons(matchedTracons, matchedFallbackTracons);

        const {
            added,
            updated,
            removed
        } = diffTracons(combineData, previousTraconsRef.current);


        // console.log("Diff Tracon Added:", added.length);
        // console.log("Diff Tracon Updated:", updated.length);
        // console.log("Diff Tracon Removed:", removed.length);

        [...added, ...updated].forEach((tracon) => {
            const iconUrl = generateTraconIcon(
                tracon.originalData.controllers[0].callsign.slice(0, -4)
            );

            if (!map.hasImage(tracon.iconId)) {
                const image = new Image();
                image.onload = () => {
                    if (!map.hasImage(tracon.iconId)) {
                        map.addImage(tracon.iconId, image, { sdf: false });
                    }
                };
                image.src = iconUrl;
            }
        });

        removed.forEach((tracon) => {
            if (map.hasImage(tracon.iconId)) {
                map.removeImage(tracon.iconId);
            }
        });


        const newGeoJson: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: combineData.map((tracon) => ({
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

        const source: GeoJSONSource = map.getSource("tracon-icon-layer-source-globe") as GeoJSONSource;
        if (source) {
            source.setData(newGeoJson);
        }

        previousTraconsRef.current = combineData;

        return () => {
            removed.forEach((tracon) => {
                if (map.hasImage(tracon.iconId)) {
                    map.removeImage(tracon.iconId);
                }
            });
        };


    }, [matchedTracons, matchedFallbackTracons, isTraconLoading, isTraconError]);


    return (
        <Source
            id="tracon-icon-layer-source-globe"
            type="geojson"
            // data={geoJsonData}
            data={{
                type: "FeatureCollection",
                features: []
            }}
        >
            <Layer
                id="tracon-icon-globe-layer"
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

export default GlobeTraconIconLayer;
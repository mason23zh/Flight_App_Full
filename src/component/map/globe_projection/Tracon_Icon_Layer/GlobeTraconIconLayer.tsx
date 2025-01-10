import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Layer, Source, useMap } from "react-map-gl";
import { FallbackTracon, MatchedTracon } from "../../../../hooks/useMatchTracon";
import generateTraconIcon from "../../mapbox_Layer/util/generateTraconIcon";
import { GeoJSON } from "geojson";


const GlobeTraconIconLayer = () => {
    const { current: mapRef } = useMap();
    const imagePrefix = "tracon-icon-";
    const {
        matchedFallbackTracons,
        matchedTracons,
        hoveredTracon,
        isLoading: isTraconLoading,
        isError: isTraconError
    } = useSelector((state: RootState) => state.matchedTracons);

    useEffect(() => {
        if (!mapRef?.getMap || isTraconLoading || isTraconError) return;
        const map = mapRef.getMap();

        const addTraconIcons = () => {
            if (matchedFallbackTracons && matchedFallbackTracons.length > 0) {
                matchedFallbackTracons.forEach((tracon: FallbackTracon) => {
                    // const lon = tracon.edgeCoordinates[0];
                    // const lat = tracon.edgeCoordinates[1];
                    // const name = (tracon.controllers && tracon.controllers.length !== 0) ?
                    //     tracon.controllers[0].airport.name + " APP/DEP" : "-";
                    const iconId = `${imagePrefix}${tracon.controllers[0].cid}`;
                    const iconUrl = generateTraconIcon(tracon.controllers[0].callsign.slice(0, -4));


                    if (!map.hasImage(iconId)) {
                        const image = new Image();
                        image.onload = () => {
                            if (!map.hasImage(iconId)) { // Check again before adding
                                map.addImage(iconId, image, { sdf: false });
                            }
                        };
                        image.onerror = () => {
                            console.error(`Error loading icon for ${tracon.controllers[0].callsign}`);
                        };
                        image.src = iconUrl; // Set the Base64 data URL as the source
                    }
                });
            }

            if (matchedTracons && matchedTracons.length > 0) {
                matchedTracons.forEach((tracon: MatchedTracon) => {
                    const iconId = `${imagePrefix}${tracon.traconInfo.uniqueId}`;
                    const iconUrl = generateTraconIcon(tracon.controllers[0].callsign.slice(0, -4));

                    console.log("iconURL:", iconUrl);

                    if (!map.hasImage(iconId)) {
                        const image = new Image();
                        image.onload = () => {
                            if (!map.hasImage(iconId)) { // Check again before adding
                                map.addImage(iconId, image, { sdf: false });
                            }
                        };
                        image.onerror = () => {
                            console.error(`Error loading icon for ${tracon.controllers[0].callsign}`);
                        };
                        image.src = iconUrl; // Set the Base64 data URL as the source
                    }
                });
            }
        };

        addTraconIcons();

        const onStyleData = () => {
            addTraconIcons();
        };

        map.on("styledata", onStyleData);

        return () => {
            map.off("styledata", onStyleData);
            try {
                matchedTracons.forEach((tracon: MatchedTracon) => {
                    const iconId = `${imagePrefix}${tracon.controllers[0].name}`;
                    if (map.hasImage(iconId)) {
                        map.removeImage(iconId);
                    }
                });

                matchedFallbackTracons.forEach((tracon: FallbackTracon) => {
                    const iconId = `${imagePrefix}${tracon.controllers[0].cid}`;
                    if (map.hasImage(iconId)) {
                        map.removeImage(iconId);
                    }
                });
            } catch (e) {
                console.error("Error cleaning up tracon icons:", e);
            }
        };

    }, [matchedTracons, matchedFallbackTracons, isTraconLoading, isTraconError]);

    console.log("matched tracon:", matchedTracons);
    console.log("Fallback tracon:", matchedFallbackTracons);

    const geoJsonData = useMemo(() => {
        if (!matchedTracons || isTraconError || isTraconLoading) return null;

        return {
            type: "FeatureCollection",
            features: matchedTracons.map((feature: MatchedTracon) => {
                const coordinates = [Number(feature.traconInfo.coordinates[0]), Number(feature.traconInfo.coordinates[1])];
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates,
                    },
                    properties: {
                        ...feature,
                        uniqueId: feature.traconInfo.uniqueId
                    }
                };
            })
        } as GeoJSON;

    }, [matchedTracons, isTraconLoading, isTraconError]);

    if (!geoJsonData) return null;


    return (
        <Source
            id="traon-icon-layer-source-globe"
            type="geojson"
            data={geoJsonData}
        >
            <Layer
                id="tracon-icon-globe-layer"
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
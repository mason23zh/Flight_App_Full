import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Layer, Source, useMap } from "react-map-gl";
import { MatchedFir } from "../../../../hooks/useMatchedFirs";
import generateFirIcon from "../../mapbox_Layer/util/generateFirIcon";
import { GeoJSON } from "geojson";

const GlobeFirIconLayer = () => {
    const { current: mapRef } = useMap();
    const {
        matchedFirs,
        hoveredFir,
        isError: errorMatchedFirs
    } = useSelector((state: RootState) => state.matchedFirs);
    const imagePrefix = "fir-icon-";

    useEffect(() => {
        if (!mapRef?.getMap || errorMatchedFirs || !matchedFirs) return;
        const map = mapRef.getMap();

        const addFirIcons = () => {
            matchedFirs.forEach((feature: MatchedFir) => {
                let iconId = "";
                let iconUrl = "";
                if (feature.isInFss || feature.firInfo.isFss) {
                    iconId = `${imagePrefix}${feature.firInfo.uniqueId}`;
                    iconUrl = generateFirIcon(feature.firInfo.firBoundary, true);

                } else {
                    iconId = `${imagePrefix}${feature.firInfo.uniqueId}`;
                    iconUrl = generateFirIcon(feature.firInfo.firBoundary, false);
                }
                if (!map.hasImage(iconId)) {
                    const image = new Image();
                    image.onload = () => {
                        if (!map.hasImage(iconId)) { // Check again before adding
                            map.addImage(iconId, image, { sdf: false });
                        }
                    };
                    image.onerror = () => {
                        console.error(`Error loading icon for ${feature.firInfo.firBoundary}`);
                    };
                    image.src = iconUrl; // Set the Base64 data URL as the source
                }
            });
        };

        addFirIcons();

        const onStyleData = () => {
            addFirIcons();
        };

        map.on("styledata", onStyleData);

        return () => {
            map.off("styledata", onStyleData);
            try {
                matchedFirs.forEach((feature: MatchedFir) => {
                    const iconId = feature.firInfo.uniqueId;
                    if (map.hasImage(iconId)) {
                        map.removeImage(iconId);
                    }
                });
            } catch (e) {
                console.error("Error cleaning up fir icons:", e);
            }
        };

    }, [matchedFirs, errorMatchedFirs, mapRef]);


    const geoJsonData = useMemo(() => {
        if (!matchedFirs || errorMatchedFirs) return null;

        return {
            type: "FeatureCollection",
            features: matchedFirs.map((feature: MatchedFir) => {
                const coordinates = [Number(feature.firInfo?.entries[0]?.label_lon), Number(feature.firInfo?.entries[0]?.label_lat)];
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates,
                    },
                    properties: {
                        ...feature,
                        controllers: JSON.stringify(feature.controllers),
                        firInfo: JSON.stringify(feature.firInfo),
                        uniqueFirId: feature.firInfo.uniqueId,
                    }
                };
            })
        } as GeoJSON;
    }, [matchedFirs, errorMatchedFirs]);

    if (!geoJsonData) return null;

    return (
        <Source
            id="fir-icon-layer-source-globe"
            type="geojson"
            data={geoJsonData}
        >
            <Layer
                id="fir-icon-globe-layer"
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
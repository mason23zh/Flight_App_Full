import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFetchVatsimPilotsDataQuery } from "../../../../store";
import { Marker, useMap } from "react-map-gl";
import { IoMdAirplane } from "react-icons/io";
// import aircraftSpriteSheetMapping from "../../../../assets/mapbox/B738.SVG"
// import B38M from "../../../../assets/mapbox/navigation.png";
import B38M from "../../../../assets/mapbox/B38M.png";
import mapboxgl from "mapbox-gl";

const VatsimTrafficLayer = () => {
    const { current: mapRef } = useMap();
    const isMapReady = useRef(false);

    // useEffect(() => {
    //     if (mapRef) {
    //         const map = mapRef?.getMap();
    //         setMap(map);
    //     }
    // }, [mapRef]);

    // make sure map loading correctly
    useEffect(() => {
        const map = mapRef?.getMap();
        if (!map) return;

        const onStyleLoaded = () => {
            isMapReady.current = true;
        };

        map.on("styledata", onStyleLoaded);

        return () => {
            map.off("styledata", onStyleLoaded);
        };

    }, [mapRef]);


    const {
        data: vatsimPilots,
        isFetching,
        error,
    } = useFetchVatsimPilotsDataQuery(undefined, { pollingInterval: 25000 });

    // if (!map || !vatsimPilots?.data?.pilots) {
    //     return null;
    // }

    useEffect(() => {
        const map = mapRef?.getMap();

        if (!map || !isMapReady.current || !vatsimPilots?.data?.pilots) return;

        // load the aircraft png to show on the map
        if (!map.hasImage("B38M")) {
            map.loadImage(B38M, (error, img) => {
                if (error) {
                    console.log("error loading img:", error);
                    throw error;
                }

                if (img) {
                    console.log("img loaded.");
                    map.addImage("B38M", img, { sdf: true });
                }
            });
        }

        const sourceId = "vatsim-traffic-globe";
        const layerId = "vatsim-traffic-globe-layer";

        // Prepare GeoJSON data
        const geoJsonData = {
            type: "FeatureCollection",
            features: vatsimPilots.data.pilots.map((pilot) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [pilot.longitude, pilot.latitude],
                },
                properties: {
                    heading: pilot.heading,
                },
            })),
        };
        // Add or update the source
        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: "geojson",
                data: geoJsonData,
            });
        } else {
            const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
            source.setData(geoJsonData);
        }
        //#c2c906
        // Add or update the layer
        if (!map.getLayer(layerId)) {
            map.addLayer({
                id: layerId,
                type: "symbol",
                source: sourceId,
                layout: {
                    "icon-image": "B38M",
                    "icon-size": 0.5,
                    "icon-rotate": ["get", "heading"], // Rotate based on heading property
                    "icon-allow-overlap": true, // Prevent icons from hiding each other
                },
                paint: {
                    "icon-color": "#c2c906",

                }
            });
        }

        return () => {
            if (!map) return;

            try {
                if (map.getLayer(layerId)) {
                    map.removeLayer(layerId);
                }
                if (map.getSource(sourceId)) {
                    map.removeSource(sourceId);
                }
            } catch (e) {
                console.error("Error clean up VatsimTrafficLayer:", e);
            }
        };
    }, [mapRef, vatsimPilots]);

    if (isFetching || error) return null;

    return null;

};

export default VatsimTrafficLayer;
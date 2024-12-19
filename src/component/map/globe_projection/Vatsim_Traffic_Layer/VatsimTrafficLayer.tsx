import React, { useEffect, useMemo } from "react";
import { RootState, useFetchVatsimPilotsDataQuery } from "../../../../store";
import { Layer, Source, useMap } from "react-map-gl";
import B38M from "../../../../assets/mapbox/B38M_1.png";
import { GeoJSON } from "geojson";
import { useSelector } from "react-redux";
//TODO: Add onHover, onClick to display traffic info
const VatsimTrafficLayer = () => {
    const { current: mapRef } = useMap();
    // mapStyles change will trigger re-render, mapRef won't change it map style changes.
    const {
        mapStyles,
        trafficLayerVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    const imageId = "B38M";

    const {
        data: vatsimPilots,
        isFetching,
        error,
    } = useFetchVatsimPilotsDataQuery(undefined, { pollingInterval: 25000 });

 
    const getJsonData: GeoJSON = useMemo(() => {
        if (!vatsimPilots?.data?.pilots) return null;

        return {
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
    }, [vatsimPilots]);


    // Load aircraft image
    useEffect(() => {
        if (!mapRef?.getMap) return;

        const map = mapRef.getMap();

        if (!map.hasImage(imageId)) {
            map.loadImage(B38M, (error, image) => {
                if (error) {
                    console.error("Error loading aircraft image in globe map:", error);
                    return;
                }

                if (image) {
                    map.addImage(imageId, image);
                }
            });
        }

        return () => {
            try {
                if (map.hasImage(imageId)) {
                    map.removeImage(imageId);
                }
            } catch (e) {
                console.error("Unable to clean up:", e);
            }
        };
    }, [mapStyles, mapRef]); //use mapStyles here to trigger re-render

    if (isFetching || error || !getJsonData || !trafficLayerVisible) return null;

    return (
        <Source
            type="geojson"
            id="vatsim-traffic-globe"
            data={getJsonData}
        >
            <Layer
                type="symbol"
                id="vatsim-traffic-globe-layer"
                layout={{
                    "icon-image": "B38M",
                    // "icon-size": 0.5,
                    "icon-size": 0.06,
                    "icon-rotate": ["get", "heading"], // Rotate based on heading property
                    "icon-allow-overlap": true, // Allow overlapping icons
                }}
                paint={{
                    "icon-color": "#c2c906",
                }}
            />
        </Source>
    );
};

export default VatsimTrafficLayer;
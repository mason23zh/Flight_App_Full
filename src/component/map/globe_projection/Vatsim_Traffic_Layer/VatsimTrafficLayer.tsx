import React, { useEffect, useMemo } from "react";
import _ from "lodash";
import { RootState, useFetchVatsimPilotsDataQuery } from "../../../../store";
import { Layer, Source, useMap } from "react-map-gl";
import B38M from "../../../../assets/mapbox/B38M_1.png";
import { GeoJSON } from "geojson";
import { useSelector } from "react-redux";
//TODO: refine onClick and onHover logic
//TODO: map style change might not render traffic immediately sometimes.
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
        if (!vatsimPilots?.data?.pilots || isFetching || error) return null;

        return {
            type: "FeatureCollection",
            features: vatsimPilots.data.pilots.map((pilot) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [pilot.longitude, pilot.latitude],
                },
                properties: {
                    ...pilot,
                    flight_plan: JSON.stringify(pilot.flight_plan)
                }
            })),
        };
    }, [vatsimPilots, mapStyles, isFetching, error]);


    // Load aircraft image
    useEffect(() => {
        if (!mapRef?.getMap) return;

        const map = mapRef.getMap();

        const loadAircraftImage = () => {
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
        };

        loadAircraftImage();

        const onStyleData = () => {
            loadAircraftImage();
        };


        return () => {
            map.off("styledata", onStyleData);
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
                interactive={true}
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
import React, { useEffect, useMemo } from "react";
import { RootState, setMapSearchSelectedAircraft, useFetchVatsimPilotsDataQuery } from "../../../../store";
import { GeoJSONSource, Layer, Source, useMap } from "react-map-gl";
import B38M from "../../../../assets/mapbox/B38M_1.png";
import { GeoJSON } from "geojson";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../../../database/db";
import { useLiveQuery } from "dexie-react-hooks";
import {
    searchByAircraftType,
    searchFlightsByAirports
} from "../../map_feature_toggle_button/search_box/mapSearchFunction";
import { VatsimFlight } from "../../../../types";
import {
    GLOBE_FIR_ICON_LAYER_ID,
    GLOBE_TRAFFIC_ICON_LAYER_ID,
    GLOBE_TRAFFIC_ICON_SOURCE_ID
} from "../layerSourceName";
import useGlobeLayerVisibility from "../../../../hooks/useGlobeLayerVisibility";

//TODO: refine onClick and onHover logic

const VatsimTrafficLayer = () => {
    const imageId = "B38M";
    const dispatch = useDispatch();
    const { current: mapRef } = useMap();
    const {
        mapStyles,
        trafficLayerVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const {
        filterAircraftOnMap: filterByAircraftType,
        selectedAircraftCategory,
    } = useSelector((state: RootState) => state.mapSearchAircraft);

    const {
        filterAircraftOnMap: filterByAirport,
        selectedAirport,
    } = useSelector((state: RootState) => state.mapSearchAirport);


    const {
        data: vatsimPilots,
        isFetching,
        error,
    } = useFetchVatsimPilotsDataQuery(undefined, { pollingInterval: 25000 });


    useEffect(() => {
        let isMounted = true;

        const syncTraffic = async () => {
            if (vatsimPilots && !error && !isFetching && isMounted) {
                try {
                    await db.syncVatsimTraffic(vatsimPilots.data.pilots);
                } catch (err) {
                    if (isMounted) {
                        console.error("Failed to import VATSIM traffic to db:", err);
                    }
                }
            }
        };

        syncTraffic();

        return () => {
            isMounted = false;
        };
    }, [isFetching, vatsimPilots, error]);

    const filteredResults = useLiveQuery<VatsimFlight[], []>(
        async () => {
            if (filterByAircraftType && selectedAircraftCategory) {
                const results = await searchByAircraftType(selectedAircraftCategory);
                dispatch(setMapSearchSelectedAircraft(results.flatMap(result => result.flights)));
                return results.flatMap(result => result.flights);
            } else if (filterByAirport && selectedAirport) {
                return await searchFlightsByAirports(selectedAirport.ident);
            }
            return vatsimPilots?.data.pilots || [];
        },
        [
            filterByAircraftType,
            selectedAircraftCategory,
            vatsimPilots,
            filterByAirport,
            selectedAirport
        ],
        []
    );

    const memoizedVatsimPilotToDisplay: VatsimFlight[] = useMemo(() => {
        return filteredResults || [];
    }, [filteredResults]);


    const getJsonData: GeoJSON = useMemo(() => {
        if (!memoizedVatsimPilotToDisplay || memoizedVatsimPilotToDisplay.length === 0 || !vatsimPilots?.data?.pilots || isFetching || error) return null;

        return {
            type: "FeatureCollection",
            features: memoizedVatsimPilotToDisplay.map((pilot) => ({
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
    }, [memoizedVatsimPilotToDisplay, mapStyles, isFetching, error]);


    useEffect(() => {
        if (!mapRef?.getMap) return;
        const map = mapRef.getMap();

        if (!getJsonData) return;

        const source = map.getSource(GLOBE_TRAFFIC_ICON_SOURCE_ID) as GeoJSONSource;
        if (source) {
            source.setData(getJsonData);
        }
    }, [getJsonData, mapRef]);

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
            //make sure traffic layer is above FIR icon layer
            map.moveLayer(GLOBE_FIR_ICON_LAYER_ID, GLOBE_TRAFFIC_ICON_LAYER_ID);
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


    //restore aircraft icons && source after map style change
    useEffect(() => {
        if (!mapRef?.getMap) return;
        const map = mapRef.getMap();

        const restoreTrafficLayer = () => {

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

            let source = map.getSource(GLOBE_TRAFFIC_ICON_SOURCE_ID) as GeoJSONSource;
            if (!source) {
                console.log("Source missing after style change! Re-adding it...");
                map.addSource(GLOBE_TRAFFIC_ICON_SOURCE_ID, {
                    type: "geojson",
                    data: getJsonData || {
                        type: "FeatureCollection",
                        features: []
                    },
                });

                map.addLayer({
                    interactive: true,
                    type: "symbol",
                    id: GLOBE_TRAFFIC_ICON_LAYER_ID,
                    source: GLOBE_TRAFFIC_ICON_SOURCE_ID,
                    layout: {
                        "icon-image": "B38M",
                        "icon-size": 0.06,
                        "icon-rotate": ["get", "heading"],
                        "icon-allow-overlap": true,
                    },
                    paint: {
                        "icon-color": "#c2c906",
                    },
                });

                source = map.getSource(GLOBE_TRAFFIC_ICON_SOURCE_ID) as GeoJSONSource;
            }

            if (source && getJsonData) {
                source.setData(getJsonData);
            }
        };

        map.on("style.load", restoreTrafficLayer);

        return () => {
            map.off("style.load", restoreTrafficLayer);
        };
    }, [mapStyles, mapRef, getJsonData]);

    //Visibility control
    useGlobeLayerVisibility(mapRef, GLOBE_TRAFFIC_ICON_LAYER_ID, trafficLayerVisible);

    return (
        <Source
            type="geojson"
            id={GLOBE_TRAFFIC_ICON_SOURCE_ID}
            // data={getJsonData}
            data={{
                type: "FeatureCollection",
                features: []
            }}
        >
            <Layer
                interactive={true}
                type="symbol"
                // beforeId="controller-icon-globe-layer" // this would cause error
                id={GLOBE_TRAFFIC_ICON_LAYER_ID}
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
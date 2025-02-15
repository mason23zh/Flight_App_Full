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
//TODO: refine onClick and onHover logic
//TODO: map style change might not render traffic immediately sometimes.
//TODO: traffic not shown upon click "show traffic" button.
const VatsimTrafficLayer = () => {
    const imageId = "B38M";
    const dispatch = useDispatch();
    const { current: mapRef } = useMap();
    // mapStyles change will trigger re-render, mapRef won't change it map style changes.
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

        const source = map.getSource("vatsim-traffic-globe") as GeoJSONSource;
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
            // make sure controller icon is above traffic layer.
            map.moveLayer("controller-icon-globe-layer", "vatsim-traffic-globe-layer");
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

    // if (isFetching || error || !getJsonData || !trafficLayerVisible) return null;


    return (
        <Source
            type="geojson"
            id="vatsim-traffic-globe"
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
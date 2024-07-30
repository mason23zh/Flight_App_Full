import React, { useEffect, useMemo, useState } from "react";
import {
    addMessage,
    removeMessageByLocation,
    RootState,
    setMapSearchSelectedAircraft,
    useFetchVatsimPilotsDataQuery
} from "../../store";
import MainTrafficLayer from "./MainTrafficLayer";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../database/db";
import { VatsimFlight } from "../../types";
import { useLiveQuery } from "dexie-react-hooks";
import {
    searchByAircraftType,
    searchFlightsByAirports
} from "./map_feature_toggle_button/search_box/mapSearchFunction";
//TODO: Need better logic handle filter traffic display
const BaseTrafficLayer = () => {
    const [vatsimPilotsToDisplay, setVatsimPilotsToDisplay] = useState<VatsimFlight[]>([]);
    const dispatch = useDispatch();

    const {
        trafficLayerVisible,
        movingMap,
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const {
        filterAircraftOnMap: filterByAircraftType,
        selectedAircraftType,
        selectedAircraftCategory,
    } = useSelector((state: RootState) => state.mapSearchAircraft);

    const {
        filterAircraftOnMap: filterByAirport,
        selectedAirport,
    } = useSelector((state: RootState) => state.mapSearchAirport);

    const {
        data: vatsimPilots,
        error: vatsimPilotsError,
        isLoading: vatsimPilotsLoading
    } = useFetchVatsimPilotsDataQuery(undefined, { pollingInterval: 25000 });

    // Import vatsim pilots into Dexie
    useEffect(() => {
        if (vatsimPilots && !vatsimPilotsError && !vatsimPilotsLoading) {
            db.syncVatsimTraffic(vatsimPilots.data.pilots)
                .catch(err => {
                    console.log("Failed to import vatsim traffic to db:", err);
                });
        }
    }, [vatsimPilotsLoading, vatsimPilots, vatsimPilotsError]);

    useEffect(() => {
        if (vatsimPilotsError) {
            dispatch(addMessage({
                location: "BASE_TRAFFIC",
                messageType: "ERROR",
                content: "Error loading Vatsim pilots data."
            }));
        }

        if (vatsimPilotsLoading) {
            dispatch(addMessage({
                location: "BASE_TRAFFIC",
                messageType: "LOADING",
                content: "Loading Vatsim pilots data..."
            }));
        }

        if (vatsimPilots && !vatsimPilotsLoading && !vatsimPilotsError) {
            dispatch(removeMessageByLocation({ location: "BASE_TRAFFIC" }));
            // initial render
            setVatsimPilotsToDisplay(vatsimPilots.data.pilots);
        }

    }, [vatsimPilotsLoading, vatsimPilotsError, vatsimPilots, dispatch]);

    /*
    * This useLiveQuery will control what traffic to display on the map,
    * it will run different query based on the redux state.
    * useLiveQuery is mandatory here because it will make sure filtered traffic on map to update
    * */
    const filteredResults = useLiveQuery(
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

    // const memoizedVatsimPilotToDisplay = useMemo(() => vatsimPilotsToDisplay, [vatsimPilotsToDisplay, vatsimPilots]);
    const memoizedVatsimPilotToDisplay = useMemo(() => filteredResults, [filteredResults]);
    return (
        <MainTrafficLayer
            vatsimPilots={memoizedVatsimPilotToDisplay}
            movingMap={movingMap}
            trafficLayerVisible={trafficLayerVisible}
        />
    );
};

export default BaseTrafficLayer;
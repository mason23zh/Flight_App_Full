import { useEffect, useMemo } from "react";
import {
    addMessage,
    removeMessageByLocation,
    RootState,
    setMapSearchSelectedAircraft,
    useFetchVatsimPilotsDataQuery
} from "../../store";
import MainDeckGlLayer from "./MainDeckGlLayer";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../database/db";
import { useLiveQuery } from "dexie-react-hooks";
import {
    searchByAircraftType,
    searchFlightsByAirports
} from "./map_feature_toggle_button/search_box/mapSearchFunction";
import { VatsimControllers } from "../../types";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface BaseDeckGlLayerProps {
    controllerData: VatsimControllers;
    controllerDataError: FetchBaseQueryError | SerializedError;
    controllerDataLoading: boolean;
}

const BaseDeckGlLayer = ({
    controllerData,
    controllerDataError,
    controllerDataLoading
}: BaseDeckGlLayerProps) => {
    const dispatch = useDispatch();

    const {
        trafficLayerVisible,
        movingMap,
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
        error: vatsimPilotsError,
        isLoading: vatsimPilotsLoading
    } = useFetchVatsimPilotsDataQuery(undefined, { pollingInterval: 25000 });


    // Import vatsim pilots into Dexie
    useEffect(() => {
        let isMounted = true;

        const syncTraffic = async () => {
            if (vatsimPilots && !vatsimPilotsError && !vatsimPilotsLoading && isMounted) {
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
        }

    }, [vatsimPilotsLoading,
        vatsimPilotsError,
        vatsimPilots,
        dispatch]);

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

    const memoizedVatsimPilotToDisplay = useMemo(() => filteredResults, [filteredResults]);
    return (
        <MainDeckGlLayer
            vatsimPilots={memoizedVatsimPilotToDisplay}
            controllerData={controllerData}
            controllerDataError={controllerDataError}
            controllerDataLoading={controllerDataLoading}
            movingMap={movingMap}
            trafficLayerVisible={trafficLayerVisible}
        />
    );
};

export default BaseDeckGlLayer;
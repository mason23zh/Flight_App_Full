import React, { useEffect, useMemo, useState } from "react";
import { addMessage, removeMessageByLocation, RootState, useFetchVatsimPilotsDataQuery } from "../../store";
import MainTrafficLayer from "./MainTrafficLayer";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../database/db";
import { VatsimFlight } from "../../types";

const BaseTrafficLayer = () => {
    const [vatsimPilotsToDisplay, setVatsimPilotsToDisplay] = useState<VatsimFlight[]>([]);
    const dispatch = useDispatch();

    const {
        trafficLayerVisible,
        movingMap,
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const {
        filterAircraftOnMap,
        selectedAircraftType
    } = useSelector((state: RootState) => state.mapSearchAircraft);

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

    useEffect(() => {
        if (filterAircraftOnMap && selectedAircraftType) {
            setVatsimPilotsToDisplay(selectedAircraftType);
        } else {
            setVatsimPilotsToDisplay(vatsimPilots?.data.pilots || []);
        }
    }, [filterAircraftOnMap, selectedAircraftType, vatsimPilots]);

    const memoizedVatsimPilotToDisplay = useMemo(() => vatsimPilotsToDisplay, [vatsimPilotsToDisplay]);
    

    // const vatsimPilotToDisplay = (filterAircraftOnMap && selectedAircraftType) ?
    //     selectedAircraftType :
    //     vatsimPilots?.data.pilots;

    return (
        <MainTrafficLayer
            vatsimPilots={memoizedVatsimPilotToDisplay}
            movingMap={movingMap}
            trafficLayerVisible={trafficLayerVisible}
        />
    );
};

export default BaseTrafficLayer;
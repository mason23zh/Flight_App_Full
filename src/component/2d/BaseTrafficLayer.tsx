import React, { useEffect } from "react";
import { addMessage, removeMessageByLocation, RootState, useFetchVatsimPilotsDataQuery } from "../../store";
import MainTrafficLayer from "./MainTrafficLayer";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../database/db";

const BaseTrafficLayer = () => {
    const dispatch = useDispatch();

    const {
        trafficLayerVisible,
        movingMap,
    } = useSelector((state: RootState) => state.vatsimMapVisible);

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
        }

    }, [vatsimPilotsLoading, vatsimPilotsError, vatsimPilots]);

    return (
        <MainTrafficLayer
            vatsimPilots={vatsimPilots?.data.pilots}
            movingMap={movingMap}
            trafficLayerVisible={trafficLayerVisible}
        />
    );
};

export default BaseTrafficLayer;
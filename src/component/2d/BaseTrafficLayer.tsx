import React, { useEffect } from "react";
import { addMessage, removeMessageByLocation, RootState, useFetchVatsimPilotsDataQuery } from "../../store";
import MainTrafficLayer from "./MainTrafficLayer";
import { useDispatch, useSelector } from "react-redux";

const BaseTrafficLayer = () => {
    const dispatch = useDispatch();

    const {
        trafficLayerVisible,
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const {
        data: vatsimPilots,
        error: vatsimPilotsError,
        isLoading: vatsimPilotsLoading
    } = useFetchVatsimPilotsDataQuery(undefined, { pollingInterval: 25000 });

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


    if (vatsimPilots && trafficLayerVisible) {
        return (
            <>
                <MainTrafficLayer vatsimPilots={vatsimPilots.data.pilots}/>
            </>
        );
    }
};

export default BaseTrafficLayer;
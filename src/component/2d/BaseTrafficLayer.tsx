import React, { useEffect } from "react";
import { addMessage, RootState, useFetchVatsimPilotsDataQuery } from "../../store";
import MainTrafficLayer from "./MainTrafficLayer";
import { useDispatch, useSelector } from "react-redux";
import ErrorLoadingMsg from "./map_error_loading/ErrorLoadingMsg";

const BaseTrafficLayer = () => {
    const dispatch = useDispatch();

    const { trafficLayerVisible } = useSelector((state: RootState) => state.vatsimMapVisible);

    const {
        data: vatsimPilots,
        error: vatsimPilotsError,
        isLoading: vatsimPilotsLoading
    } = useFetchVatsimPilotsDataQuery(undefined, { pollingInterval: 25000 });

    useEffect(() => {
        if (vatsimPilotsError) {
            dispatch(addMessage("Error loading Vatsim pilots data."));
        }

        if (vatsimPilotsLoading) {
            dispatch(addMessage("Loading Vatsim pilots data..."));
        }

    }, [vatsimPilotsLoading, vatsimPilotsError]);

    if (vatsimPilots && trafficLayerVisible) {
        return <MainTrafficLayer vatsimPilots={vatsimPilots.data.pilots}/>;
    }
};

export default BaseTrafficLayer;
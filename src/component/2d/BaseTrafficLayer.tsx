import React from "react";
import { RootState, useFetchVatsimPilotsDataQuery } from "../../store";
import MainTrafficLayer from "./MainTrafficLayer";
import { useSelector } from "react-redux";
import ErrorLoadingMsg from "./ErrorLoadingMsg";

const BaseTrafficLayer = () => {
    const { trafficLayerVisible } = useSelector((state: RootState) => state.vatsimMapVisible);
    const {
        data: vatsimPilots,
        error: vatsimPilotsError,
        isLoading: vatsimPilotsLoading
    } = useFetchVatsimPilotsDataQuery(undefined, { pollingInterval: 25000 });


    if (vatsimPilotsError) {
        return <ErrorLoadingMsg message="Error loading Vatsim Pilots data"/>;
    }

    if (vatsimPilotsLoading) {
        return <ErrorLoadingMsg message="loading Vatsim Pilots data"/>;
    }

    if (vatsimPilots && trafficLayerVisible) {
        return <MainTrafficLayer vatsimPilots={vatsimPilots.data.pilots}/>;
    }
};

export default BaseTrafficLayer;
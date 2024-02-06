import React from "react";
import { RootState, useFetchVatsimPilotsDataQuery } from "../../store";
import MainTrafficLayer from "./MainTrafficLayer";
import { useSelector } from "react-redux";

const BaseTrafficLayer = () => {
    const { trafficLayerVisible } = useSelector((state: RootState) => state.vatsimMapVisible);
    const {
        data: vatsimPilots,
        error: vatsimPilotsError,
        isLoading: vatsimPilotsLoading
    } = useFetchVatsimPilotsDataQuery(undefined, { pollingInterval: 25000 });


    if (vatsimPilotsError) {
        return <div
            className="fixed top-50 left-50 z-50 w-auto h-auto flex items-center justify-center bg-opacity-50 bg-black text-white">Error
            loading Vatsim Pilots data
        </div>;
    }

    if (vatsimPilotsLoading) {
        return <div
            className="fixed top-50 left-50 z-50 w-auto h-auto flex items-center justify-center bg-opacity-50 bg-black text-white">
            loading Vatsim Pilots data
        </div>;
    }

    if (vatsimPilots && trafficLayerVisible) {
        return <MainTrafficLayer vatsimPilots={vatsimPilots.data.pilots}/>;
    }
};

export default BaseTrafficLayer;
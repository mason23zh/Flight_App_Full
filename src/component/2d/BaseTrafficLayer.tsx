import React from "react";
import { useFetchVatsimPilotsDataQuery } from "../../store";
import MainTrafficLayer from "./MainTrafficLayer";

const BaseTrafficLayer = () => {
    const {
        data: vatsimPilots,
        error: vatsimPilotsError,
        isLoading: vatsimPilotsLoading
    } = useFetchVatsimPilotsDataQuery();


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

    if (vatsimPilots) {
        return <MainTrafficLayer vatsimPilots={vatsimPilots.data.pilots}/>;
    }
};

export default BaseTrafficLayer;
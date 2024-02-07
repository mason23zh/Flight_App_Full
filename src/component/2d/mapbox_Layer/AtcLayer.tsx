import React from "react";
import { RootState, useFetchVatsimControllersDataQuery } from "../../../store";
import FirLayer from "./FIR_Layers/FirLayer";
import TraconLayer from "./Tracon_Layers/TraconLayer";
import ControllerMarkerLayer from "./Controller_Markers_Layer/ControllerMarkerLayer";
import { useSelector } from "react-redux";

const AtcLayer = () => {

    const {
        allAtcLayerVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const {
        data: controllerData,
        error: controllerError,
        isLoading: controllerLoading
    } = useFetchVatsimControllersDataQuery();

    if (controllerLoading) {
        return <div
            className="fixed top-50 left-50 z-50 w-auto h-auto flex items-center justify-center bg-opacity-50 bg-black text-white">
            loading controllers...</div>;
    }

    if (controllerError) {
        return <div
            className="fixed top-50 left-50 z-50 w-auto h-auto flex items-center justify-center bg-opacity-50 bg-black text-white">Error
            loading controllers...</div>;
    }


    return (
        <>
            {allAtcLayerVisible && (<>
                <FirLayer controllerInfo={controllerData} labelVisible={true}/>
                <TraconLayer controllerInfo={controllerData} labelVisible={true}/>
                <ControllerMarkerLayer controllerInfo={controllerData} labelVisible={true}/>
            </>)
            }
        </>
    );
};

export default AtcLayer;
import React, { useEffect } from "react";
import { addMessage, RootState, useFetchVatsimControllersDataQuery } from "../../../store";
import FirLayer from "./FIR_Layers/FirLayer";
import TraconLayer from "./Tracon_Layers/TraconLayer";
import ControllerMarkerLayer from "./Controller_Markers_Layer/ControllerMarkerLayer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const AtcLayer = () => {
    const dispatch = useDispatch();

    const {
        allAtcLayerVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    //update controller info every 60 seconds
    const {
        data: controllerData,
        error: controllerError,
        isLoading: controllerLoading
    } = useFetchVatsimControllersDataQuery(undefined, { pollingInterval: 60000 });

    useEffect(() => {
        if (controllerLoading) {
            dispatch(addMessage("Loading controllers..."));
        }

        if (controllerError) {
            dispatch(addMessage("Error loading controllers."));
        }
    }, [controllerError, controllerLoading, controllerData]);

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
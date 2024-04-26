import React, { useEffect } from "react";
import { addMessage, removeMessageByLocation, RootState, useFetchVatsimControllersDataQuery } from "../../../store";
import FirLayer from "./FIR_Layers/FirLayer";
import TraconLayer from "./Tracon_Layers/TraconLayer";
import ControllerMarkerLayer from "./Controller_Markers_Layer/ControllerMarkerLayer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import testData from "../../../test_data/vatsim-data-ctp-controllers-only.json";

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
            dispatch(addMessage({
                location: "ATC",
                messageType: "LOADING",
                content: "Loading controllers..."
            }));
        }

        if (controllerError) {
            dispatch(addMessage({
                location: "ATC",
                messageType: "ERROR",
                content: "Error loading controllers data."
            }));
        }

        if (controllerData && !controllerLoading && !controllerError) {
            dispatch(removeMessageByLocation({ location: "ATC" }));
        }
    }, [controllerError, controllerLoading, controllerData]);

    return (
        <>
            {allAtcLayerVisible && (<>
                <FirLayer controllerInfo={testData} labelVisible={true}/>
                <TraconLayer controllerInfo={testData} labelVisible={true}/>
                <ControllerMarkerLayer controllerInfo={controllerData} labelVisible={true}/>
            </>)
            }
        </>
    );
};

export default AtcLayer;
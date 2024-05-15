import React, { useEffect } from "react";
import {
    addMessage,
    removeMessageByLocation,
    RootState,
    useFetchVatsimControllersDataQuery,
    useFetchVatsimFirBoundariesQuery
} from "../../../store";
import FirLayer from "./FIR_Layers/FirLayer";
import TraconLayer from "./Tracon_Layers/TraconLayer";
import ControllerMarkerLayer from "./Controller_Markers_Layer/ControllerMarkerLayer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
// import testData from "../../../test_data/vatsim-czeg-fss.json";
import FirUnderlineLayer from "./FIR_Layers/FirUnderlineLayer";

const AtcLayer = () => {
    const dispatch = useDispatch();

    const {
        allAtcLayerVisible,
        underlineFirBoundaries
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    //update controller info every 60 seconds
    const {
        data: controllerData,
        error: controllerError,
        isLoading: controllerLoading
    } = useFetchVatsimControllersDataQuery(undefined, { pollingInterval: 60000 });

    const {
        data: geoJsonData,
        error: geoJsonError,
        isLoading: geoJsonLoading
    } = useFetchVatsimFirBoundariesQuery();


    useEffect(() => {
        if (controllerLoading || geoJsonLoading) {
            dispatch(addMessage({
                location: "ATC",
                messageType: "LOADING",
                content: "Loading controllers..."
            }));
        }

        if (controllerError || geoJsonError) {
            dispatch(addMessage({
                location: "ATC",
                messageType: "ERROR",
                content: "Error loading controllers data."
            }));
        }

        if (controllerData &&
                geoJsonData &&
                !controllerLoading &&
                !controllerError &&
                !geoJsonLoading &&
                !geoJsonError) {
            dispatch(removeMessageByLocation({ location: "ATC" }));
        }
    }, [controllerError, controllerLoading, controllerData]);

    return (
        <>
            {underlineFirBoundaries && <FirUnderlineLayer geoJsonData={geoJsonData}/>}
            {allAtcLayerVisible && (<>
                <FirLayer controllerInfo={controllerData} geoJsonData={geoJsonData} labelVisible={true}/>
                <TraconLayer controllerInfo={controllerData} labelVisible={true}/>
                <ControllerMarkerLayer controllerInfo={controllerData} labelVisible={true}/>
            </>)
            }
        </>
    );
};
 
export default AtcLayer;
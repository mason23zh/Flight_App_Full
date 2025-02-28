import React, { useEffect, useMemo } from "react";
import {
    addMessage,
    removeMessageByLocation,
    RootState,
    useFetchVatsimFirBoundariesQuery
} from "../../../store";
import FirLayer from "./FIR_Layers/FirLayer";
import TraconLayer from "./Tracon_Layers/TraconLayer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import FirUnderlineLayer from "./FIR_Layers/FirUnderlineLayer";
import testData from "../../../test_data/getvatsimcontrollers-mismatch-edgg-edmm.json";
import { VatsimControllers } from "../../../types";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface AtcLayerProps {
    controllerData: VatsimControllers | null;
    controllerLoading: boolean;
    controllerError: SerializedError | FetchBaseQueryError;
}

const AtcLayer = ({
    controllerData,
    controllerError,
    controllerLoading
}: AtcLayerProps) => {
    const dispatch = useDispatch();

    const {
        allAtcLayerVisible,
        underlineFirBoundaries
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const {
        data: geoJsonData,
        error: geoJsonError,
        isLoading: geoJsonLoading
    } = useFetchVatsimFirBoundariesQuery();

    console.log("Atc layer run.");

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


    const newControllerData = useMemo(() => controllerData, [JSON.stringify(controllerData)]);

    return (
        <>
            {underlineFirBoundaries && <FirUnderlineLayer/>}
            {allAtcLayerVisible && (<>
                <FirLayer controllerInfo={newControllerData}/>
                <TraconLayer controllerInfo={newControllerData}/>
            </>)
            }
        </>
    );
};

export default AtcLayer;
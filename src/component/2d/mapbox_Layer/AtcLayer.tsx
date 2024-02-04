import React, { useState } from "react";
import { RootState, useFetchVatsimControllersDataQuery } from "../../../store";
import FirLayer from "./FIR_Layers/FirLayer";
import TraconLayer from "./Tracon_Layers/TraconLayer";
import ControllerMarkerLayer from "./Controller_Markers_Layer/ControllerMarkerLayer";
import { VatsimFlight } from "../../../types";
import LayerTogglePanel from "../LayerTogglePanel";
import { useSelector } from "react-redux";

const AtcLayer = () => {
    // const [controllerLayerVisible, setControllerLayerVisible] = useState<boolean>(true);
    // const [traconLabelVisible, setTraconLabelVisible] = useState<boolean>(true);
    // const [controllerMarkerVisible, setControllerMarkerVisible] = useState<boolean>(true);
    // const [mapRoadVisible, setMapRoadVisible] = useState<boolean>(false);
    // const [firLabelVisible, setFirLabelVisible] = useState<boolean>(true);
    // const [trackLayerVisible, setTrackLayerVisible] = useState<boolean>(false);
    // const [trafficLayerVisible, setTrafficLayerVisible] = useState<boolean>(true);
    // const [mapLabelVisible, setMapLabelVisible] = useState<boolean>(true);
    // const [satelliteLayerVisible, setSatelliteLayerVisible] = useState<boolean>(false);
    // const [weatherRasterVisible, setWeatherRasterVisible] = useState<boolean>(false);
    // const [selectTraffic, setSelectTraffic] = useState<VatsimFlight | null>(null);

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
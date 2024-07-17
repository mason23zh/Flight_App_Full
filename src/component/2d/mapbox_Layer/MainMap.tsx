import React from "react";
import BaseMap from "./BaseMap";
import AtcLayer from "./AtcLayer";
import BaseTrafficLayer from "../BaseTrafficLayer";
import NexradLayer from "./Nexrad_Layer/NxradLayer";
import MapErrorMessageStack from "../map_error_loading/MapErrorMessageStack";
import FlightInfo from "../detail_flight_info_panel/FlightInfo";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { VatsimFlight } from "../../../types";
import DayNightLayer from "./DayNightTerminator_Layers/DayNightLayer";
import { useInitializeDatabase } from "../../../hooks/useInitializeDatabase";


const MainMap = () => {
    const traffic = useSelector<RootState, VatsimFlight>(
        state => state.vatsimMapTraffic.selectedTraffic || null);

    const {
        dayNightTerminator,
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    useInitializeDatabase();

    if (!window.WebGLRenderingContext) {
        return (
            <div>
                Unsupported Device
            </div>
        );
    }

    return (
        <div>
            <BaseMap>
                <MapErrorMessageStack/>
                <AtcLayer/>
                <BaseTrafficLayer/>
                <NexradLayer/>
                {dayNightTerminator && <DayNightLayer/>}
                {(traffic && traffic.callsign.length !== 0) && <FlightInfo/>}
            </BaseMap>
        </div>
    );
};

export default MainMap;
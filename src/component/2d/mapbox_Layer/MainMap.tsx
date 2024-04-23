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


const MainMap = () => {
    const traffic = useSelector<RootState, VatsimFlight>(
        state => state.vatsimMapTraffic.selectedTraffic || null);
    return (
        <div className="">
            <BaseMap>
                <MapErrorMessageStack/>
                <AtcLayer/>
                <BaseTrafficLayer/>
                <NexradLayer/>
                {(traffic && traffic.callsign.length !== 0) && <FlightInfo/>}
            </BaseMap>
        </div>
    );
};

export default MainMap;
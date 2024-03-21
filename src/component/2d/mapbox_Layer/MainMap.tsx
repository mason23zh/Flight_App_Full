import React from "react";
import BaseMap from "./BaseMap";
import AtcLayer from "./AtcLayer";
import BaseTrafficLayer from "../BaseTrafficLayer";
import NexradLayer from "./Nexrad_Layer/NxradLayer";
import MapErrorMessageStack from "../map_error_loading/MapErrorMessageStack";
import FlightInfo from "../detail_flight_info_panel/FlightInfo";

const MainMap = () => {
    return (
        <div>
            <BaseMap>
                <MapErrorMessageStack/>
                <AtcLayer/>
                <BaseTrafficLayer/>
                <NexradLayer/>
                <FlightInfo/>
            </BaseMap>
        </div>
    );
};

export default MainMap;
import React from "react";
import BaseMap from "./BaseMap";
import AtcLayer from "./AtcLayer";
import LayerTogglePanel from "../LayerTogglePanel";
import BaseTrafficLayer from "../BaseTrafficLayer";
import NexradLayer from "./Nexrad_Layer/NxradLayer";
import MapErrorMessageStack from "../map_error_loading/MapErrorMessageStack";
import TestTogglePanel from "../TestTogglePanel";

const MainMap = () => {
    return (
        <div>
            <BaseMap>
                {/* <TestTogglePanel/> */}
                <MapErrorMessageStack/>
                <AtcLayer/>
                <BaseTrafficLayer/>
                <NexradLayer/>
            </BaseMap>
        </div>
    );
};

export default MainMap;
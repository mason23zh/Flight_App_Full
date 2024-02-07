import React from "react";
import BaseMap from "./BaseMap";
import AtcLayer from "./AtcLayer";
import LayerTogglePanel from "../LayerTogglePanel";
import BaseTrafficLayer from "../BaseTrafficLayer";
import NexradLayer from "./Nexrad_Layer/NxradLayer";

const MainMap = () => {
    return (
        <div>
            <BaseMap>
                <AtcLayer/>
                <LayerTogglePanel/>
                <BaseTrafficLayer/>
                <NexradLayer/>
            </BaseMap>
        </div>
    );
};

export default MainMap;
import React from "react";
import BaseMap from "./BaseMap";
import AtcLayer from "./AtcLayer";
import LayerTogglePanel from "../LayerTogglePanel";
import LayerTogglePanel2 from "../LayerTogglePanel2";
import BaseTrafficLayer from "../BaseTrafficLayer";
import NexradLayer from "./Nexrad_Layer/NxradLayer";

const MainMap = () => {
    return (
        <div>
            <BaseMap>
                <AtcLayer/>
                <LayerTogglePanel2/>
                <BaseTrafficLayer/>
                <NexradLayer labelVisible={true}/>
            </BaseMap>
        </div>
    );
};

export default MainMap;
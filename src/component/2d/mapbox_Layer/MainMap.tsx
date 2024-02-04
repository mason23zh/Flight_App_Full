import React from "react";
import BaseMap from "./BaseMap";
import AtcLayer from "./AtcLayer";
import LayerTogglePanel from "../LayerTogglePanel";
import LayerTogglePanel2 from "../LayerTogglePanel2";
import BaseTrafficLayer from "../BaseTrafficLayer";

const MainMap = () => {
    return (
        <div>
            <BaseMap>
                <AtcLayer/>
                <LayerTogglePanel2/>
                <BaseTrafficLayer/>
            </BaseMap>
        </div>
    );
};

export default MainMap;
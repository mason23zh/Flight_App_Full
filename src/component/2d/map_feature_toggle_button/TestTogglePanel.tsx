import React from "react";
import MapFeaturesToggleButton from "./MapFeaturesToggleButton";
import { useDispatch } from "react-redux";
import { toggleAtcLayer, toggleTrafficLayer, toggleWeatherRasterLayer } from "../../../store";
import { IoAirplane } from "react-icons/io5";
import { TiWeatherDownpour } from "react-icons/ti";
import { GiControlTower } from "react-icons/gi";
import MapFeaturesToggleButtonGroup from "./MapFeaturesToggleButtonGroup";
import { FaLayerGroup } from "react-icons/fa";
import MapStyleToggleButtonGroup from "./MapStyleToggleButtonGroup";

import { MapRef } from "react-map-gl";
import MapStyleToggleButton from "./MapStyleToggleButton";
import MapFilterToggleButton from "./MapFilterToggleButton";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

const TestTogglePanel = ({ mapRef }: Props) => {
    const dispatch = useDispatch();

    return (
        <div className="z-500 absolute">
            <div className="flex flex-col gap-2 p-1 bg-gray-700 rounded-md ml-2 mt-5 w-auto">
                <MapFeaturesToggleButton
                    onToggle={(activeFlag) => dispatch(toggleTrafficLayer(activeFlag))}
                    icon={<IoAirplane/>}
                    initialActive={true}
                />

                <MapFeaturesToggleButton
                    onToggle={(activeFlag) => dispatch(toggleAtcLayer(activeFlag))}
                    icon={<GiControlTower/>}
                    initialActive={true}
                />

                <MapFeaturesToggleButton
                    onToggle={(activeFlag) => dispatch(toggleWeatherRasterLayer(activeFlag))}
                    icon={<TiWeatherDownpour/>}
                    initialActive={false}
                />

                <MapStyleToggleButton mapRef={mapRef}/>

                <MapFilterToggleButton mapRef={mapRef}/>

            </div>
        </div>
    );
};

export default TestTogglePanel;
import React from "react";
import MapFeaturesToggleButton from "./MapFeaturesToggleButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleAtcLayer, toggleTrafficLayer, toggleWeatherRasterLayer } from "../../../store";
import { IoAirplane } from "react-icons/io5";
import { TiWeatherDownpour } from "react-icons/ti";
import { GiControlTower } from "react-icons/gi";

import { MapRef } from "react-map-gl";
import MapStyleToggleButton from "./MapStyleToggleButton";
import MapFilterToggleButton from "./MapFilterToggleButton";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

//!BUG map feature setting not sync when map style changes

const TogglePanel = ({ mapRef }: Props) => {
    const {
        allAtcLayerVisible,
        trafficLayerVisible,
        weatherRasterVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    const dispatch = useDispatch();

    return (
        <div className="z-[200] absolute">
            <div className="flex flex-col gap-2 p-1 bg-gray-700 rounded-md ml-2 mt-5 w-auto">
                <MapFeaturesToggleButton
                    onToggle={(activeFlag) => dispatch(toggleTrafficLayer(activeFlag))}
                    icon={<IoAirplane/>}
                    initialActive={trafficLayerVisible}
                />

                <MapFeaturesToggleButton
                    onToggle={(activeFlag) => dispatch(toggleAtcLayer(activeFlag))}
                    icon={<GiControlTower/>}
                    initialActive={allAtcLayerVisible}
                />

                <MapFeaturesToggleButton
                    onToggle={(activeFlag) => dispatch(toggleWeatherRasterLayer(activeFlag))}
                    icon={<TiWeatherDownpour/>}
                    initialActive={weatherRasterVisible}
                />

                <MapStyleToggleButton mapRef={mapRef}/>

                <MapFilterToggleButton mapRef={mapRef}/>

            </div>
        </div>
    );
};

export default TogglePanel;
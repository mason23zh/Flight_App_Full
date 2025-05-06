import React from "react";
import {
    toggleAtcLayer,
    toggleMapLabel,
    toggleMapRoadLabel,
    toggleSatelliteLayer,
    toggleTrafficLayer,
    toggleWeatherRasterLayer
} from "../../store";
import { useDispatch } from "react-redux";
import { IoAirplane } from "react-icons/io5";
import { AiFillTags } from "react-icons/ai";
import { FaSatellite, FaRoad } from "react-icons/fa";
import { GiControlTower } from "react-icons/gi";
import { TiWeatherDownpour } from "react-icons/ti";


import { Toggle } from "rsuite";

const LayerTogglePanel = () => {
    const dispatch = useDispatch();
    const handleOnChangeTraffic = (e: boolean) => {
        dispatch(toggleTrafficLayer(e));
    };

    const handleOnChangeLabel = (e: boolean) => {
        dispatch(toggleMapLabel(e));
    };

    const handleOnChangeSatellite = (e: boolean) => {
        dispatch(toggleSatelliteLayer(e));
    };

    const handleOnChangeController = () => {
        dispatch(toggleAtcLayer());
    };

    const handleOnChangeRoad = (e: boolean) => {
        dispatch(toggleMapRoadLabel(e));
    };

    const handleOnChangeWeather = () => {
        dispatch(toggleWeatherRasterLayer());
    };


    return (
        <div className="bg-gray-400 opacity-50 px-2 py-1
        z-1 absolute bottom-5 right-[50%] m-[12px] rounded-xl
        hover:opacity-90
        ">
            <div className="flex items-center gap-4">
                <div className="py-1 px-2">
                    <Toggle
                        size="md"
                        defaultChecked
                        checkedChildren={<IoAirplane/>}
                        unCheckedChildren={<IoAirplane/>}
                        onChange={(checked) => handleOnChangeTraffic(checked)}
                    />
                </div>
                <div className="py-1 px-2">
                    <Toggle
                        size="md"
                        defaultChecked
                        checkedChildren={<AiFillTags/>}
                        unCheckedChildren={<AiFillTags/>}
                        onChange={(checked) => handleOnChangeLabel(checked)}
                    />
                </div>
                <div className="py-1 px-2">
                    <Toggle
                        size="md"
                        defaultChecked={false}
                        checkedChildren={<FaSatellite/>}
                        unCheckedChildren={<FaSatellite/>}
                        onChange={(checked) => handleOnChangeSatellite(checked)}
                    />
                </div>
                <div className="py-1 px-2">
                    <Toggle
                        size="md"
                        defaultChecked
                        checkedChildren={<GiControlTower/>}
                        unCheckedChildren={<GiControlTower/>}
                        onChange={() => handleOnChangeController()}
                    />
                </div>
                <div className="py-1 px-2">
                    <Toggle
                        size="md"
                        checkedChildren={<FaRoad/>}
                        unCheckedChildren={<FaRoad/>}
                        onChange={(checked) => handleOnChangeRoad(checked)}
                    />
                </div>

                <div className="py-1 px-2">
                    <Toggle
                        size="md"
                        checkedChildren={<TiWeatherDownpour/>}
                        unCheckedChildren={<TiWeatherDownpour/>}
                        onChange={() => handleOnChangeWeather()}
                    />
                </div>

            </div>
        </div>
    );
};

export default LayerTogglePanel;
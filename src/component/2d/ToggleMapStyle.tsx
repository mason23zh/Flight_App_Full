import React, { useEffect, useState } from "react";
import { Button, Popover, Whisper } from "rsuite";
import { IoAirplane } from "react-icons/io5";
import { GiControlTower } from "react-icons/gi";
import { FaRegMap, FaLayerGroup } from "react-icons/fa";
import { TiWeatherDownpour } from "react-icons/ti";


import switchMapStyles from "./switchMapStyles";
import { useDispatch, useSelector } from "react-redux";
import {
    RootState,
    toggleAtcLayer,
    toggleControllerLayer,
    toggleTrafficLayer,
    toggleWeatherRasterLayer
} from "../../store";
import MapStyleToggleButtonGroup from "./MapStyleToggleButtonGroup";
import MapFeaturesToggleButtonGroup from "./MapFeaturesToggleButtonGroup";

type MapStyle = "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE"


const ToggleMapStyle = ({ mapRef }) => {
    const dispatch = useDispatch();

    // const [mapStyle, setMapStyle] = useState<MapStyle>("DEFAULT");
    const [toggleControllers, setToggleControllers] = useState<boolean>(true);
    const [toggleTraffics, setToggleTraffics] = useState<boolean>(true);
    const [toggleWeathers, setToggleWeathers] = useState<boolean>(false);


    return (
        <div className="flex flex-col items-center">

            <Button
                active={toggleTraffics}
                onClick={() => {
                    setToggleTraffics(prev => !prev);
                    dispatch(toggleTrafficLayer(toggleTraffics));
                }}
            >
                <IoAirplane/>
            </Button>


            <Button
                active={toggleControllers}
                onClick={() => {
                    setToggleControllers(prev => !prev);
                    dispatch(toggleAtcLayer(toggleControllers));
                }}
            >
                <GiControlTower/>
            </Button>


            <Button
                active={toggleWeathers}
                onClick={() => {
                    setToggleWeathers(prev => !prev);
                    dispatch(toggleWeatherRasterLayer(toggleWeathers));
                }}
            >
                <TiWeatherDownpour/>
            </Button>


            <Whisper
                placement="right"
                trigger="click"
                speaker={
                    <Popover arrow={false}>
                        <MapStyleToggleButtonGroup mapRef={mapRef}/>
                    </Popover>
                }
            >
                <Button><FaRegMap/></Button>
            </Whisper>

            <Whisper
                placement="right"
                trigger="click"
                speaker={
                    <Popover arrow={false}>
                        <MapFeaturesToggleButtonGroup mapRef={mapRef}/>
                    </Popover>
                }
            >
                <Button><FaLayerGroup/></Button>
            </Whisper>

        </div>
    );
};

export default ToggleMapStyle;
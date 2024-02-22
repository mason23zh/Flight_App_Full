import React, { useEffect, useState } from "react";
import { Button, Popover, Whisper, IconButton, ButtonGroup } from "rsuite";
import { IoAirplane } from "react-icons/io5";
import { GiControlTower } from "react-icons/gi";
import { FaRegMap, FaLayerGroup } from "react-icons/fa";
import { TiWeatherDownpour } from "react-icons/ti";


import { useDispatch } from "react-redux";
import {
    toggleAtcLayer,
    toggleTrafficLayer,
    toggleWeatherRasterLayer
} from "../../store";
import MapStyleToggleButtonGroup from "./MapStyleToggleButtonGroup";
import MapFeaturesToggleButtonGroup from "./MapFeaturesToggleButtonGroup";
import MapFeaturesToggleButton from "./MapFeaturesToggleButton";

type MapStyle = "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE"


const ToggleMapStyle = ({ mapRef }) => {
    const dispatch = useDispatch();

    // const [mapStyle, setMapStyle] = useState<MapStyle>("DEFAULT");
    const [toggleControllers, setToggleControllers] = useState<boolean>(true);
    const [toggleTraffics, setToggleTraffics] = useState<boolean>(true);
    const [toggleWeathers, setToggleWeathers] = useState<boolean>(false);
    console.log("TOGGLE CONTROLLERS:", toggleControllers);


    const handleTrafficButtonClick = () => {
        setToggleTraffics(prev => !prev);
    };

    // useEffect(() => {
    //     if (toggleTraffics) {
    //         dispatch(toggleTrafficLayer(toggleTraffics));
    //     }
    // }, [toggleTraffics]);

    return (
        <div className="flex flex-col items-center">
            {/* <MapFeaturesToggleButton */}
            {/*     onToggle={(active) => dispatch(toggleTrafficLayer(active))} */}
            {/* > */}
            {/*     TEST BUTTON */}
            {/* </MapFeaturesToggleButton> */}


            {/* <Button */}
            {/*     active={toggleTraffics} */}
            {/*     onClick={handleTrafficButtonClick} */}
            {/* > */}
            {/*     <IoAirplane/> */}
            {/* </Button> */}

            <Button
                active={toggleControllers}
                // disabled={toggleControllers}
                onClick={() => {
                    const newActiveState = !toggleControllers;
                    setToggleControllers(newActiveState);
                    dispatch(toggleAtcLayer(newActiveState));
                    //setTimeout(() => dispatch(toggleAtcLayer(newActiveState)), 0);
                    // setToggleControllers(prev => {
                    //     const newState = !prev;
                    //     dispatch(toggleAtcLayer(newState));
                    //     return newState;
                    // });
                }}
            >
                <GiControlTower/>
            </Button>

            <Button
                active={toggleWeathers}
                onClick={() => {
                    setToggleWeathers(prev => {
                        const newState = !prev;
                        dispatch(toggleWeatherRasterLayer(newState));
                        return newState;
                    });
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

export default React.memo(ToggleMapStyle);
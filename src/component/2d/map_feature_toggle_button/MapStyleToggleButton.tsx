import React, { useEffect, useState } from "react";
import MapStyleToggleButtonGroup from "./MapStyleToggleButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleMapStyleButton } from "../../../store";
import useDisplayTooltip from "../../../hooks/useDisplayTooltip";
import { MapRef, useMap } from "react-map-gl";
import mapboxgl from "mapbox-gl";

type MapStyleName = "VFR" | "NGT" | "DAY" | "SAT"
type MapStyle = "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE"

interface Props {
    isTouchScreen: boolean;
}

const MapStyleToggleButton = ({
    isTouchScreen
}: Props) => {
    let mapStyleName: MapStyleName;
    const dispatch = useDispatch();
    const { current: mapRef } = useMap();
    // when user click the button, tooltip will disappear
    const [buttonClick, setButtonClick] = useState(false);
    const [map, setMap] = useState<mapboxgl.Map>(null);
    const { mapStyles } = useSelector((state: RootState) => state.vatsimMapVisible);
    const {
        mapStyleButtonToggle
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    const {
        handleMouseMove,
        handleMouseLeave,
        handleMouseEnter,
        tooltipVisible,
        resetTooltip,
        mousePosition
    } = useDisplayTooltip(600);

    useEffect(() => {
        if (mapRef) {
            const map = mapRef?.getMap();
            setMap(map);
        }
    }, [mapRef]);

    // close the popup when mapStyle changes
    useEffect(() => {
        dispatch(toggleMapStyleButton(false));
    }, [mapStyles]);

    switch (mapStyles) {
    case "DEFAULT":
        mapStyleName = "VFR";
        break;
    case "MONO_LIGHT":
        mapStyleName = "DAY";
        break;
    case "MONO_DARK":
        mapStyleName = "NGT";
        break;
    case "SATELLITE":
        mapStyleName = "SAT";
        break;
    }

    useEffect(() => {
        if (buttonClick) {
            setButtonClick(false);
            resetTooltip();
        }
    }, [tooltipVisible, buttonClick, resetTooltip]);

    const handleOnClick = () => {
        setButtonClick(true);
        resetTooltip();
        dispatch(toggleMapStyleButton(!mapStyleButtonToggle));
    };

    const setMapStyle = (mapName: MapStyle) => {
        if (map) {

            let styleUrl: string;
            switch (mapName) {
            case "DEFAULT":
                styleUrl = import.meta.env.VITE_MAPBOX_MAIN_STYLE;
                map.setStyle(styleUrl);
                break;
            case "MONO_LIGHT":
                styleUrl = import.meta.env.VITE_MAPBOX_MONOCHROME_LIGHT_STYLE;
                map.setStyle(styleUrl);
                break;
            case "MONO_DARK":
                styleUrl = import.meta.env.VITE_MAPBOX_MONOCHROME_DARK_STYLE;
                map.setStyle(styleUrl);
                break;
            case "SATELLITE":
                styleUrl = import.meta.env.VITE_MAPBOX_SATELLITE_STREET_STYLE;
                map.setStyle(styleUrl);
                break;
            default:
                map.setStyle(import.meta.env.VITE_MAPBOX_MAIN_STYLE);
            }
        }
    };

    useEffect(() => {
        setMapStyle(mapStyles);
    }, [mapStyles]);

    const inactiveButtonClass = isTouchScreen ?
        "relative px-2 py-1 bg-gray-500 rounded-md text-white text-[10px] text-center" :
        "relative px-2 py-1 bg-gray-500 rounded-md text-white text-[10px] text-center hover:bg-gray-400";
    const activeButtonClass = isTouchScreen ?
        "relative px-2 py-1 bg-blue-500 rounded-md text-white text-[10px] text-center" :
        "relative px-2 py-1 bg-blue-500 rounded-md text-white text-[10px] text-center hover:bg-blue-400";


    return (
        <div>
            <button
                className={mapStyleButtonToggle ? activeButtonClass : inactiveButtonClass}
                onClick={handleOnClick}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
            >
                {mapStyleName}
            </button>
            <div
                className={`absolute bottom-[110%] left-auto right-auto sm:left-[110%] sm:bottom-0.5 transform 
                transition-all duration-300  
                ease-in-out 
                ${mapStyleButtonToggle ? "translate-x-0 opacity-100" : "-translate-x-5 opacity-0"}
                `}
                style={{ visibility: mapStyleButtonToggle ? "visible" : "hidden" }}
            >
                {mapStyleButtonToggle ?
                    <MapStyleToggleButtonGroup/>
                    : ""
                }
            </div>
            {(tooltipVisible && !buttonClick && !isTouchScreen) &&
                <div
                    className="fixed px-2 py-1 bg-black text-white
                        text-xs rounded-md pointer-events-none z-40"
                    style={{
                        top: mousePosition.y + 15,
                        left: mousePosition.x + 15,
                    }}
                >
                    Switching map style
                </div>
            }
        </div
        >
    );
};

export default MapStyleToggleButton;
import React, { useEffect, useState } from "react";
import { MapRef, useMap } from "react-map-gl";
import { FaLayerGroup } from "react-icons/fa";
import MapFeaturesToggleButtonGroup from "./MapFeaturesToggleButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleMapFilterButton } from "../../../store";
import useDisplayTooltip from "../../../hooks/useDisplayTooltip";

interface Props {
    isTouchScreen: boolean;
}

const MapFilterToggleButton = ({
    isTouchScreen
}: Props) => {
    const dispatch = useDispatch();
    const [buttonClick, setButtonClick] = useState(false);
    const {
        mapFilterButtonToggle,
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const {
        handleMouseEnter,
        handleMouseLeave,
        handleMouseMove,
        tooltipVisible,
        resetTooltip,
        mousePosition
    } = useDisplayTooltip(600);

    useEffect(() => {
        if (buttonClick) {
            resetTooltip();
            setButtonClick(false);
        }
    }, [tooltipVisible, buttonClick, resetTooltip]);

    const handleOnClick = () => {
        dispatch(toggleMapFilterButton(!mapFilterButtonToggle));
        setButtonClick(true);
        resetTooltip();
    };

    const inactiveButtonClass = isTouchScreen ?
        "relative px-2 py-1 bg-gray-500 rounded-md text-white items-center w-full" :
        "relative px-2 py-1 bg-gray-500 rounded-md text-white items-center w-full hover:bg-gray-400";
    const activeButtonClass = isTouchScreen ?
        "relative px-2 py-1 bg-blue-500 rounded-md text-white items-center w-full" :
        "relative px-2 py-1 bg-blue-500 rounded-md text-white items-center w-full hover:bg-blue-400";

    return (
        <div>
            <button
                className={mapFilterButtonToggle ? activeButtonClass : inactiveButtonClass}
                onClick={handleOnClick}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
            >
                <FaLayerGroup className="text-white text-xl"/>
            </button>

            <div
                className={`absolute bottom-[110%] left-[25%] sm:left-[110%] sm:bottom-[-40%] transform 
                transition-all duration-300 
                ease-in-out 
                ${mapFilterButtonToggle ? "translate-x-0 opacity-100" : "-translate-x-5 opacity-0"}`}
                style={{ visibility: mapFilterButtonToggle ? "visible" : "hidden" }}
            >
                <MapFeaturesToggleButtonGroup isTouchScreen={isTouchScreen}/>
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
                    Map feature selector
                </div>
            }
        </div>
    );
};

export default MapFilterToggleButton;
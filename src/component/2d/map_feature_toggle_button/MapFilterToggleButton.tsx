import React, { useEffect, useState } from "react";
import { MapRef } from "react-map-gl";
import { FaLayerGroup } from "react-icons/fa";
import MapFeaturesToggleButtonGroup from "./MapFeaturesToggleButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleMapFilterButton } from "../../../store";
import useDisplayTooltip from "../../../hooks/useDisplayTooltip";

interface Props {
    mapRef: React.RefObject<MapRef>;
    isTouchScreen: boolean;
}

const MapFilterToggleButton = ({
    mapRef,
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
        mousePosition
    } = useDisplayTooltip(400);

    useEffect(() => {
        setButtonClick(false);
    }, [tooltipVisible]);

    const handleOnClick = () => {
        dispatch(toggleMapFilterButton(!mapFilterButtonToggle));
        setButtonClick(true);
    };

    return (
        <div>
            <button
                className="relative px-2 py-1 bg-gray-400 rounded-md text-white items-center w-full"
                onClick={handleOnClick}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
            >
                <FaLayerGroup className="text-white text-xl"/>
            </button>

            <div
                className={`absolute bottom-[110%] left-[25%] sm:left-[110%] sm:bottom-[-10%] transform 
                transition-all duration-300 
                ease-in-out 
                ${mapFilterButtonToggle ? "translate-x-0 opacity-100" : "-translate-x-5 opacity-0"}`}
                style={{ visibility: mapFilterButtonToggle ? "visible" : "hidden" }}
            >
                <MapFeaturesToggleButtonGroup mapRef={mapRef}/>
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
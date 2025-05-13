import { useEffect, useState } from "react";
import { FaLayerGroup } from "react-icons/fa";
import MapFeaturesToggleButtonGroup from "./MapFeaturesToggleButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleMapFilterButton } from "../../../store";
import { Tooltip } from "react-tooltip";

interface Props {
    isTouchScreen: boolean;
}

const MapFilterToggleButton = ({
    isTouchScreen
}: Props) => {
    const dispatch = useDispatch();
    const [buttonClick, setButtonClick] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const {
        mapFilterButtonToggle,
    } = useSelector((state: RootState) => state.vatsimMapVisible);


    useEffect(() => {
        if (buttonClick) {
            setButtonClick(false);
        }
    }, [buttonClick]);

    const handleOnClick = () => {
        dispatch(toggleMapFilterButton(!mapFilterButtonToggle));
        setButtonClick(true);
    };

    const inactiveButtonClass = isTouchScreen ?
        "relative px-2 py-1 bg-gray-500 rounded-md text-white items-center w-full" :
        "relative px-2 py-1 bg-gray-500 rounded-md text-white items-center w-full hover:bg-gray-400";
    const activeButtonClass = isTouchScreen ?
        "relative px-2 py-1 bg-blue-500 rounded-md text-white items-center w-full" :
        "relative px-2 py-1 bg-blue-500 rounded-md text-white items-center w-full hover:bg-blue-400";

    const tooltipMessage = "Map feature selector";

    return (
        <div>
            <button
                id="map-filter-toggle-button"
                className={mapFilterButtonToggle ? activeButtonClass : inactiveButtonClass}
                onClick={handleOnClick}
                onMouseEnter={() => setShowTooltip(false)}
                onMouseLeave={() => setShowTooltip(true)}
            >
                <FaLayerGroup className="text-white text-xl" />
            </button>

            <div
                className={`absolute bottom-[110%] left-[25%] sm:left-[110%] sm:bottom-[-40%] transform 
                transition-all duration-300 
                ease-in-out 
                ${mapFilterButtonToggle ? "translate-x-0 opacity-100" : "-translate-x-5 opacity-0"}`}
                style={{ visibility: mapFilterButtonToggle ? "visible" : "hidden" }}
            >
                <MapFeaturesToggleButtonGroup isTouchScreen={isTouchScreen} />
            </div>

            {(!isTouchScreen && !buttonClick && !mapFilterButtonToggle) &&
                <Tooltip
                    hidden={showTooltip}
                    anchorSelect="#map-filter-toggle-button"
                    delayShow={300}
                    style={{
                        backgroundColor: "rgb(0,0,0)",
                        color: "rgb(255,255,255)",
                        fontSize: "13px",
                        padding: "5px",
                        borderRadius: "5px"
                    }}
                >
                    {tooltipMessage}
                </Tooltip>
            }
        </div>
    );
};

export default MapFilterToggleButton;
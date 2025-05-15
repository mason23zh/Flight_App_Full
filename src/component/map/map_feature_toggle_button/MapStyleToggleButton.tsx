import { useEffect, useState } from "react";
import MapStyleToggleButtonGroup from "./MapStyleToggleButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleMapStyleButton } from "../../../store";
import { Tooltip } from "react-tooltip";

type MapStyleName = "VFR" | "NGT" | "DAY" | "SAT"

interface Props {
    isTouchScreen: boolean;
}

const MapStyleToggleButton = ({
    isTouchScreen
}: Props) => {
    let mapStyleName: MapStyleName;
    const dispatch = useDispatch();
    // when user click the button, tooltip will disappear
    const [buttonClick, setButtonClick] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const { mapStyles } = useSelector((state: RootState) => state.vatsimMapVisible);
    const {
        mapStyleButtonToggle
    } = useSelector((state: RootState) => state.vatsimMapVisible);

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
        }
    }, [buttonClick]);

    const handleOnClick = () => {
        setButtonClick(true);
        dispatch(toggleMapStyleButton(!mapStyleButtonToggle));
    };


    const inactiveButtonClass = isTouchScreen ?
        "relative px-2 py-1 bg-gray-500 rounded-md text-white text-[10px] text-center" :
        "relative px-2 py-1 bg-gray-500 rounded-md text-white text-[10px] text-center hover:bg-gray-400";
    const activeButtonClass = isTouchScreen ?
        "relative px-2 py-1 bg-blue-500 rounded-md text-white text-[10px] text-center" :
        "relative px-2 py-1 bg-blue-500 rounded-md text-white text-[10px] text-center hover:bg-blue-400";

    const tooltipMessage = "Switching map style";

    return (
        <div>
            <button
                className={mapStyleButtonToggle ? activeButtonClass : inactiveButtonClass}
                onClick={handleOnClick}
                onMouseEnter={() => setShowTooltip(false)}
                onMouseLeave={() => setShowTooltip(true)}
                id="map-style-toggle-button"
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
                    <MapStyleToggleButtonGroup />
                    : ""
                }
            </div>

            {(!isTouchScreen && !buttonClick && !mapStyleButtonToggle) &&
                <Tooltip
                    hidden={showTooltip}
                    anchorSelect="#map-style-toggle-button"
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
        </div
        >
    );
};

export default MapStyleToggleButton;
import React, { useEffect } from "react";
import MapStyleToggleButtonGroup from "./MapStyleToggleButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleMapStyleButton } from "../../../store";
import useDisplayTooltip from "../../../hooks/useDisplayTooltip";

type MapStyleName = "VFR" | "NGT" | "DAY" | "SAT"
type MapStyle = "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE"


const MapStyleToggleButton = ({ mapRef }) => {
    let mapStyleName: MapStyleName;
    const dispatch = useDispatch();
    const { mapStyles } = useSelector((state: RootState) => state.vatsimMapVisible);
    const {
        mapStyleButtonToggle
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    const {
        handleMouseMove,
        handleMouseLeave,
        handleMouseEnter,
        tooltipVisible,
        mousePosition
    } = useDisplayTooltip(400);

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
    const handleOnClick = () => {
        dispatch(toggleMapStyleButton(!mapStyleButtonToggle));
    };

    const setMapStyle = (mapName: MapStyle) => {
        if (mapRef.current) {
            const map = mapRef.current.getMap();
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


    return (
        <div>
            <button
                className="relative p-2 bg-gray-400 rounded-md text-xs text-white"
                onClick={handleOnClick}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
            >
                {mapStyleName}
            </button>

            <div className={`absolute left-[110%] bottom-0.5 transform 
            ${mapStyleButtonToggle ? "translate-x-0" : "-translate-x-5"} transition-transform duration-300 ease-in-out`
            }
            >
                {mapStyleButtonToggle ?
                    <MapStyleToggleButtonGroup/>
                    : ""
                }
            </div>
            {tooltipVisible &&
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
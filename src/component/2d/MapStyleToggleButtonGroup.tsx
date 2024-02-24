import React, { useEffect, useState } from "react";
import { MapRef } from "react-map-gl";
import { useDispatch, useSelector } from "react-redux";
import { RootState, switchMapStyle } from "../../store";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

type MapStyle = "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE"


const MapStyleToggleButtonGroup = ({ mapRef }: Props) => {
    const [activeStyle, setActiveStyle] = useState("DEFAULT");
    const dispatch = useDispatch();
    const { mapStyle } = useSelector((state: RootState) => state.vatsimMapStyle);

    // setActiveStyle here to avoid async behaviour in handleClick function
    useEffect(() => {
        setActiveStyle(mapStyle);
    }, [mapStyle]);
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

    const activeButtonStyle = "p-1 bg-gray-400 hover:bg-gray-600 rounded-md";
    const inactiveButtonStyle = "p-1 bg-gray-500 hover:bg-gray-600 rounded-md";

    const handleOnClick = (mapStyle: MapStyle) => {
        setMapStyle(mapStyle);
        //setActiveStyle(mapStyle);
        dispatch(switchMapStyle({ mapStyle: mapStyle }));
    };


    return (
        <div className="flex flex-col gap-1 rounded-md bg-gray-700 text-sm p-2 text-white">
            <button
                className={activeStyle === "DEFAULT" ? activeButtonStyle : inactiveButtonStyle}
                onClick={() => handleOnClick("DEFAULT")}>
                VFR
            </button>

            <button
                className={activeStyle === "MONO_LIGHT" ? activeButtonStyle : inactiveButtonStyle}
                onClick={() => handleOnClick("MONO_LIGHT")}>
                Light
            </button>

            <button
                className={activeStyle === "MONO_DARK" ? activeButtonStyle : inactiveButtonStyle}
                onClick={() => handleOnClick("MONO_DARK")}>
                Dark
            </button>

            <button
                className={activeStyle === "SATELLITE" ? activeButtonStyle : inactiveButtonStyle}
                onClick={() => handleOnClick("SATELLITE")}>
                Satellite
            </button>
        </div>
    );
};

export default MapStyleToggleButtonGroup;
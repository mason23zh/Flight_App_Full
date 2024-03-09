import React, { useEffect, useState } from "react";
import { MapRef } from "react-map-gl";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store, switchMapStyle, switchMapStyles } from "../../../store";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

type MapStyle = "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE"


const MapStyleToggleButtonGroup = ({ mapRef }: Props) => {
    // const [activeStyle, setActiveStyle] = useState("DEFAULT");
    const dispatch = useDispatch();
    // const { mapStyle } = useSelector((state: RootState) => state.vatsimMapStyle);
    const { mapStyles } = useSelector((state: RootState) => state.vatsimMapVisible);

    // setActiveStyle here to avoid async behaviour in handleClick function
    // useEffect(() => {
    //     console.log("MAP STYLES:", mapStyles);
    //     if (mapRef.current && mapStyles) {
    //         // setActiveStyle(mapStyles);
    //         setMapStyle(mapStyles);
    //     }
    // }, [mapStyles, mapRef]);

    // useEffect(() => {
    //     // Dispatch an action to update mapStyle based on the persisted state
    //     // This is a fallback to ensure that the map style is applied
    //     // even if the initial rehydration does not trigger the useEffect as expected
    //     const persistedState = store.getState().vatsimMapVisible.mapStyles;
    //     if (persistedState) {
    //         dispatch(switchMapStyles({ mapStyles: persistedState }));
    //     }
    // }, [dispatch]);

    // const setMapStyle = (mapName: MapStyle) => {
    //     if (mapRef.current) {
    //         const map = mapRef.current.getMap();
    //         let styleUrl: string;
    //         console.log("MAP NAME:", mapName);
    //         switch (mapName) {
    //         case "DEFAULT":
    //             styleUrl = import.meta.env.VITE_MAPBOX_MAIN_STYLE;
    //             map.setStyle(styleUrl);
    //             break;
    //         case "MONO_LIGHT":
    //             styleUrl = import.meta.env.VITE_MAPBOX_MONOCHROME_LIGHT_STYLE;
    //             map.setStyle(styleUrl);
    //             break;
    //         case "MONO_DARK":
    //             styleUrl = import.meta.env.VITE_MAPBOX_MONOCHROME_DARK_STYLE;
    //             map.setStyle(styleUrl);
    //             break;
    //         case "SATELLITE":
    //             styleUrl = import.meta.env.VITE_MAPBOX_SATELLITE_STREET_STYLE;
    //             map.setStyle(styleUrl);
    //             break;
    //         default:
    //             map.setStyle(import.meta.env.VITE_MAPBOX_MAIN_STYLE);
    //         }
    //     }
    // };

    const activeButtonStyle = "p-1 bg-gray-400 hover:bg-gray-600 rounded-md";
    const inactiveButtonStyle = "p-1 bg-gray-500 hover:bg-gray-600 rounded-md";

    const handleOnClick = (mapStyle: MapStyle) => {
        //setMapStyle(mapStyle);
        // dispatch(switchMapStyle({ mapStyle: mapStyle }));
        dispatch(switchMapStyles({ mapStyles: mapStyle }));
    };


    return (
        <div className="container min-w-[80px]">
            <div className="flex flex-col gap-1 rounded-md bg-gray-700 text-sm p-2 text-white">
                <button
                    className={mapStyles === "DEFAULT" ? activeButtonStyle : inactiveButtonStyle}
                    onClick={() => handleOnClick("DEFAULT")}>
                    VFR
                </button>

                <button
                    className={mapStyles === "MONO_LIGHT" ? activeButtonStyle : inactiveButtonStyle}
                    onClick={() => handleOnClick("MONO_LIGHT")}>
                    Light
                </button>

                <button
                    className={mapStyles === "MONO_DARK" ? activeButtonStyle : inactiveButtonStyle}
                    onClick={() => handleOnClick("MONO_DARK")}>
                    Dark
                </button>

                <button
                    className={mapStyles === "SATELLITE" ? activeButtonStyle : inactiveButtonStyle}
                    onClick={() => handleOnClick("SATELLITE")}>
                    Satellite
                </button>
            </div>
        </div>
    );
};

export default React.memo(MapStyleToggleButtonGroup);
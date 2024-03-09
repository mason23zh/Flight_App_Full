import React, { useEffect } from "react";
import MapStyleToggleButtonGroup from "./MapStyleToggleButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleMapStyleButton } from "../../../store";

type MapStyleName = "VFR" | "NGT" | "DAY" | "SAT"
type MapStyle = "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE"


const MapStyleToggleButton = ({ mapRef }) => {
    const dispatch = useDispatch();
    // const { mapStyle } = useSelector((state: RootState) => state.vatsimMapStyle);
    const { mapStyles } = useSelector((state: RootState) => state.vatsimMapVisible);
    // console.log("MAP STYLE:", mapStyle);
    const {
        mapStyleButtonToggle
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    // close the popup when mapStyle changes
    useEffect(() => {
        dispatch(toggleMapStyleButton(false));
    }, [mapStyles]);

    let mapStyleName: MapStyleName;
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
            console.log("MAP NAME:", mapName);
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
            >
                {mapStyleName}
            </button>

            <div className={`absolute left-[110%] bottom-0.5 transform 
            ${mapStyleButtonToggle ? "translate-x-0" : "-translate-x-5"} transition-transform duration-300 ease-in-out`
            }
            >
                {mapStyleButtonToggle ?
                    <MapStyleToggleButtonGroup mapRef={mapRef}/>
                    : ""
                }
            </div>
        </div>
    );
};

export default MapStyleToggleButton;
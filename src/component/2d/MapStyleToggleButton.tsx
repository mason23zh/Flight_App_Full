import React, { useState } from "react";
import MapStyleToggleButtonGroup from "./MapStyleToggleButtonGroup";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type MapStyleName = "VFR" | "NGT" | "DAY" | "SAT"

const MapStyleToggleButton = ({ mapRef }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { mapStyle } = useSelector((state: RootState) => state.vatsimMapStyle);
    let mapStyleName: MapStyleName;
    switch (mapStyle) {
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
        setIsOpen(prev => !prev);
    };

    return (
        <div>
            <button
                className="relative p-2 bg-gray-400 rounded-md text-xs text-white"
                onClick={handleOnClick}
            >
                {mapStyleName}
            </button>
            {isOpen ?
                <div className="absolute left-[100%] bottom-0.5 ml-1">
                    <MapStyleToggleButtonGroup mapRef={mapRef}/>
                </div>
                : ""
            }
        </div>
    );
};

export default MapStyleToggleButton;
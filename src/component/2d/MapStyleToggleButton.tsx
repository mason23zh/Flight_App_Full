import React, { useEffect, useState } from "react";
import MapStyleToggleButtonGroup from "./MapStyleToggleButtonGroup";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type MapStyleName = "VFR" | "NGT" | "DAY" | "SAT"

const MapStyleToggleButton = ({ mapRef }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { mapStyle } = useSelector((state: RootState) => state.vatsimMapStyle);

    // close the popup when mapStyle changes
    useEffect(() => {
        setIsOpen(false);
    }, [mapStyle]);

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

            <div className={`absolute left-[110%] bottom-0.5 transform 
            ${isOpen ? "translate-x-0" : "-translate-x-5"} transition-transform duration-300 ease-in-out`
            }
            >
                {isOpen ?
                    <MapStyleToggleButtonGroup mapRef={mapRef}/>
                    : ""
                }
            </div>
        </div>
    );
};

export default MapStyleToggleButton;
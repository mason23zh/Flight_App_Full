import React, { useEffect } from "react";
import MapStyleToggleButtonGroup from "./MapStyleToggleButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleMapStyleButton } from "../../../store";

type MapStyleName = "VFR" | "NGT" | "DAY" | "SAT"


const MapStyleToggleButton = ({ mapRef }) => {
    const dispatch = useDispatch();
    const { mapStyle } = useSelector((state: RootState) => state.vatsimMapStyle);
    console.log("MAP STYLE:", mapStyle);
    const {
        mapStyleButtonToggle
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    // close the popup when mapStyle changes
    useEffect(() => {
        dispatch(toggleMapStyleButton(false));
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
        dispatch(toggleMapStyleButton(!mapStyleButtonToggle));
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
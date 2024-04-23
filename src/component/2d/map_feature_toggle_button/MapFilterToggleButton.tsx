import React from "react";
import { MapRef } from "react-map-gl";
import { FaLayerGroup } from "react-icons/fa";
import MapFeaturesToggleButtonGroup from "./MapFeaturesToggleButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleMapFilterButton } from "../../../store";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

const MapFilterToggleButton = ({ mapRef }: Props) => {
    const dispatch = useDispatch();
    const {
        mapFilterButtonToggle,
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    const handleOnClick = () => {
        dispatch(toggleMapFilterButton(!mapFilterButtonToggle));
    };

    return (
        <div>
            <button
                className="relative px-2 py-1 bg-gray-400 rounded-md text-white items-center w-full"
                onClick={handleOnClick}
            >
                <FaLayerGroup className="text-white text-xl"/>
            </button>

            <div
                className={`absolute left-[110%] bottom-0.5 transform 
                transition-all duration-300 
                ease-in-out ${mapFilterButtonToggle ? "translate-x-0 opacity-100" : "-translate-x-5 opacity-0"}`}
                style={{ visibility: mapFilterButtonToggle ? "visible" : "hidden" }}
            >
                <MapFeaturesToggleButtonGroup mapRef={mapRef}/>
            </div>
        </div>
    );
};

export default MapFilterToggleButton;
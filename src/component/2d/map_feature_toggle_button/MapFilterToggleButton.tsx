import React, { useEffect, useState } from "react";
import { MapRef } from "react-map-gl";
import { FaLayerGroup } from "react-icons/fa";
import MapFeaturesToggleButtonGroup from "./MapFeaturesToggleButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleMapFilterButton, toggleMapStyleButton } from "../../../store";

import mapStyleToggleButton from "./MapStyleToggleButton";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

const MapFilterToggleButton = ({ mapRef }: Props) => {
    const dispatch = useDispatch();
    const {
        mapFilterButtonToggle,
        mapStyleButtonToggle
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    const handleOnClick = () => {
        dispatch(toggleMapFilterButton(!mapFilterButtonToggle));
    };

    useEffect(() => {
        if (mapStyleButtonToggle) {
            dispatch(toggleMapFilterButton(false));
        }
    }, [mapStyleToggleButton]);

    return (
        <div>
            <button
                className="relative px-2 py-1 bg-gray-400 rounded-md text-white items-center w-full"
                onClick={handleOnClick}
            >
                <FaLayerGroup className="text-white text-xl"/>
            </button>

            <div className={`absolute left-[110%] bottom-0.5 transform 
            ${mapFilterButtonToggle ? "translate-x-0" : "-translate-x-5"} transition-transform duration-300 ease-in-out`
            }
            >
                {mapFilterButtonToggle ?
                    <MapFeaturesToggleButtonGroup mapRef={mapRef}/>
                    : ""
                }
            </div>
        </div>
    );
};

export default MapFilterToggleButton;
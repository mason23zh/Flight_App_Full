import React, { useEffect, useState } from "react";
import { MapRef } from "react-map-gl";
import MapStyleToggleButtonGroup from "./MapStyleToggleButtonGroup";
import { FaLayerGroup } from "react-icons/fa";
import MapFeaturesToggleButtonGroup from "./MapFeaturesToggleButtonGroup";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

const MapFilterToggleButton = ({ mapRef }: Props) => {
    const {
        mapRoadVisible,
        mapLabelVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const handleOnClick = () => {
        setIsOpen(prev => !prev);
    };

    useEffect(() => {
        setIsOpen(false);
    }, [mapRoadVisible, mapLabelVisible]);


    useEffect(() => {
        setIsOpen(false);
    }, []);


    return (
        <div>
            <button
                className="relative px-2 py-1 bg-gray-400 rounded-md text-white items-center w-full"
                onClick={handleOnClick}
            >
                <FaLayerGroup className="text-white text-xl"/>
            </button>

            <div className={`absolute left-[110%] bottom-0.5 transform 
            ${isOpen ? "translate-x-0" : "-translate-x-5"} transition-transform duration-300 ease-in-out`
            }
            >
                {isOpen ?
                    <MapFeaturesToggleButtonGroup mapRef={mapRef}/>
                    : ""
                }
            </div>
        </div>
    );
};

export default MapFilterToggleButton;
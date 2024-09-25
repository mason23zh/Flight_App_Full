import React, { useEffect, useState } from "react";
import { VscZoomIn, VscZoomOut } from "react-icons/vsc";
import { TbNavigationNorth } from "react-icons/tb";
import { useMap } from "react-map-gl";
import mapboxgl from "mapbox-gl";


const CustomNavigationController = () => {
    const { current: mapRef } = useMap();
    const [map, setMap] = useState<mapboxgl.Map>(null);

    const parentStyle = "z-[200] absolute sm:bottom-0 bottom-10 left-0 w-fit p-2";
    const childStyle = "flex flex-col items-start ml-2 mt-2 justify-start gap-2 p-1 bg-gray-700 rounded-md";
    const buttonStyle = "text-gray-50 bg-gray-500 hover:bg-gray-400 hover:cursor-pointer p-1 rounded-lg text-xl";

    useEffect(() => {
        if (mapRef) {
            const map = mapRef?.getMap();
            setMap(map);
        }
    }, [mapRef]);

    const handleZoomIn = () => {
        if (map) {
            map.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (map) {
            map.zoomOut();
        }
    };

    const handleResetNorth = () => {
        if (map) {
            map.setBearing(0);
            map.resetNorthPitch();
        }
    };

    return (
        <div className={parentStyle}>
            <div className="flex justify-center w-full sm:w-auto">
                <div className={childStyle}>
                    <div className={buttonStyle} onClick={handleZoomIn}>
                        <VscZoomIn/>
                    </div>
                    <div className={buttonStyle} onClick={handleZoomOut}>
                        <VscZoomOut/>
                    </div>
                    <div className={buttonStyle} onClick={handleResetNorth}>
                        <TbNavigationNorth/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomNavigationController;
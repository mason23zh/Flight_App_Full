import React, { useEffect, useState } from "react";
import { MapRef } from "react-map-gl";
import switchMapLabels from "./switchMapLabels";
import switchMapRoads from "./switchMapRoads";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

type Tag = "LABEL" | "ROAD" | "BUILDING";

const MapFeaturesToggleButtonGroup = ({ mapRef }: Props) => {
    const [activeStyle, setActiveStyle] = useState<Tag>("LABEL");
    const [mapLabel, setMapLabel] = useState<boolean>(true);
    const [mapRoad, setMapRoad] = useState<boolean>(false);
    const [mapBuilding, setMapBuilding] = useState<boolean>(true);

    const setMapFeatures = (mapRef: React.RefObject<MapRef>, flag: boolean, tag: Tag) => {
        if (mapRef.current) {
            switch (tag) {
            case "LABEL":
                switchMapLabels(mapRef, flag);
                break;
            case "ROAD":
                switchMapRoads(mapRef, flag);
                break;
            }
        }
    };

    useEffect(() => {
        if (mapRef.current) {
            setMapFeatures(mapRef, mapLabel, "LABEL");
        }
    }, [mapLabel, mapRef]);

    useEffect(() => {
        if (mapRef.current) {
            setMapFeatures(mapRef, mapRoad, "ROAD");
        }
    }, [mapRoad, mapRef]);


    const handleOnClick = (mapFeature: Tag) => {
        switch (mapFeature) {
        case "LABEL":
            setMapLabel(prev => !prev);
            break;
        case "ROAD":
            setMapRoad(prev => !prev);
            break;
        }
    };

    const activeButtonStyle = "p-1 bg-gray-400 hover:bg-gray-600 rounded-md";
    const inactiveButtonStyle = "p-1 bg-gray-500 hover:bg-gray-600 rounded-md";

    return (
        <div className="flex flex-col gap-1 rounded-md bg-gray-700 text-sm p-2 text-white">
            <button
                className={mapLabel ? activeButtonStyle : inactiveButtonStyle}
                onClick={() => handleOnClick("LABEL")}
            >
                Label
            </button>

            <button
                className={mapRoad ? activeButtonStyle : inactiveButtonStyle}
                onClick={() => handleOnClick("ROAD")}
            >
                Road
            </button>
        </div>
    );
};

export default MapFeaturesToggleButtonGroup;
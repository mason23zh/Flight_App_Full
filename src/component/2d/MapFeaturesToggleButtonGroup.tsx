import React, { useState } from "react";
import { Button, ButtonGroup } from "rsuite";
import { MapRef } from "react-map-gl";
import switchMapLabels from "./switchMapLabels";
import switchMapRoads from "./switchMapRoads";
import MapFeaturesToggleButton from "./MapFeaturesToggleButton";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

type Tag = "LABEL" | "ROAD" | "BUILDING";


const MapFeaturesToggleButtonGroup = ({ mapRef }: Props) => {
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

    const handleOnClick = (mapFeature: Tag) => {
        switch (mapFeature) {
        case "LABEL":
            setMapLabel(prev => !prev);
            setMapFeatures(mapRef, mapLabel, mapFeature);
            break;
        case "ROAD":
            setMapRoad(prev => !prev);
            setMapFeatures(mapRef, mapRoad, mapFeature);
        }
    };

    return (
        <div className="flex flex-col gap-1 rounded-md bg-gray-700 text-sm p-2 text-white">
            <button
                onClick={() => handleOnClick("LABEL")}
            >
                Label
            </button>

            <button
                onClick={() => handleOnClick("ROAD")}
            >
                Road
            </button>
        </div>
    );


    // return (
    //     <ButtonGroup block={true} vertical={true}>
    //         <Button
    //             active={mapLabel}
    //             onClick={() => {
    //                 setMapLabel(prev => {
    //                     const newState = !prev;
    //                     setMapFeatures(mapRef, newState, "LABEL");
    //                     return newState;
    //                 });
    //             }}>Label</Button>
    //
    //         <Button
    //             active={mapRoad}
    //             onClick={() => {
    //                 setMapRoad(prev => {
    //                     const newState = !prev;
    //                     setMapFeatures(mapRef, newState, "ROAD");
    //                     return newState;
    //                 });
    //             }}>Road</Button>
    //
    //         <Button>Building</Button>
    //     </ButtonGroup>
    // );
};

export default MapFeaturesToggleButtonGroup;
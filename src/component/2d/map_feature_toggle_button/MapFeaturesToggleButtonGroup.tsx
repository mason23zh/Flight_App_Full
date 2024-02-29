import React, { useEffect, useState } from "react";
import { MapRef } from "react-map-gl";
import switchMapLabels from "../switchMapLabels";
import switchMapRoads from "../switchMapRoads";
import { useDispatch } from "react-redux";
import { Toggle } from "rsuite";
import { toggleMapFilterButton, toggleMapLabel, toggleMapRoadLabel } from "../../../store";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

type Tag = "LABEL" | "ROAD" | "BUILDING";
//!BUG toggle behaviour incorrect
const MapFeaturesToggleButtonGroup = ({
    mapRef
}: Props) => {
    const dispatch = useDispatch();
    const [mapLabel, setMapLabel] = useState<boolean>(true);
    const [mapRoad, setMapRoad] = useState<boolean>(false);

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

    // useEffect(() => {
    //     if (mapRef.current) {
    //         setMapFeatures(mapRef, mapLabel, "LABEL");
    //         dispatch(toggleMapLabel(mapLabel));
    //     }
    // }, [mapLabel, mapRef]);

    useEffect(() => {
        if (mapRef.current) {
            setMapFeatures(mapRef, mapRoad, "ROAD");
            dispatch(toggleMapRoadLabel(mapRoad));
        }
    }, [mapRoad, mapRef]);


    const handleOnClick = (mapFeature: Tag) => {
        switch (mapFeature) {
        case "LABEL": {
            const newMapLabelState = !mapLabel;
            setMapLabel(newMapLabelState);
            setMapFeatures(mapRef, newMapLabelState, "LABEL");
            dispatch(toggleMapLabel(newMapLabelState));
            break;
        }
        case "ROAD":
            setMapRoad(prev => !prev);
            break;
        }
    };

    const activeButtonStyle = "p-1 bg-gray-400 hover:bg-gray-600 rounded-md";
    const inactiveButtonStyle = "p-1 bg-gray-500 hover:bg-gray-600 rounded-md";

    return (
        <div className="min-w-[280px] bg-gray-500 rounded-lg p-1">
            <div className="text-center font-bold text-white text-lg p-2">
                Map Feature Toggle
            </div>
            <div className="container grid-cols-1 gap-1 w-full font-bold text-sm text-white">
                <div className="flex justify-between p-1 ml-2 mr-2 border-b border-t">
                    <div>Label</div>
                    <Toggle/>
                </div>
                <div className="flex justify-between p-1 ml-2 mr-2">
                    <div>Road</div>
                    <Toggle/>
                </div>
                {/* <div className="flex flex-col gap-1 rounded-md bg-gray-700 text-sm p-2 text-white"> */}
                {/*     <button */}
                {/*         className={mapLabel ? activeButtonStyle : inactiveButtonStyle} */}
                {/*         onClick={() => handleOnClick("LABEL")} */}
                {/*     > */}
                {/*         Label */}
                {/*     </button> */}

                {/*     <button */}
                {/*         className={mapRoad ? activeButtonStyle : inactiveButtonStyle} */}
                {/*         onClick={() => handleOnClick("ROAD")} */}
                {/*     > */}
                {/*         Road */}
                {/*     </button> */}
                {/* </div> */}
            </div>
        </div>
    );
};

export default MapFeaturesToggleButtonGroup;
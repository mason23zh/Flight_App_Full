import React, { useEffect, useState } from "react";
import MapFeaturesToggleButton from "./MapFeaturesToggleButton";
import { useDispatch, useSelector } from "react-redux";
import {
    addMessage,
    removeMessageByLocation,
    RootState,
    toggleAtcLayer,
    toggleTrafficLayer,
    toggleWeatherRasterLayer
} from "../../../store";
import { IoAirplane } from "react-icons/io5";
import { TiWeatherDownpour } from "react-icons/ti";
import { GiControlTower } from "react-icons/gi";

import { MapRef } from "react-map-gl";
import MapStyleToggleButton from "./MapStyleToggleButton";
import MapFilterToggleButton from "./MapFilterToggleButton";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

//!FIX The map will snap back to the default and return to normal
// if the localStorage map is not
 
//!TODO: Performance improvement
const TogglePanel = ({ mapRef }: Props) => {
    const {
        allAtcLayerVisible,
        trafficLayerVisible,
        weatherRasterVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const dispatch = useDispatch();


    useEffect(() => {
        const map = mapRef.current?.getMap();
        if (!map) {
            console.warn("Map reference not found");
            dispatch(addMessage({
                location: "BASE_MAP",
                messageType: "ERROR",
                content: "Error loading map."
            }));
            return;
        }

        const handleMapLoad = () => {
            dispatch(removeMessageByLocation({ location: "BASE_MAP" }));
            setIsMapLoaded(true);
        };

        map.on("load", handleMapLoad);

        return () => {
            map.off("load", handleMapLoad);
        };
    }, [mapRef]);

    if (!isMapLoaded) {
        dispatch(addMessage({
            location: "BASE_MAP",
            messageType: "LOADING",
            content: "Loading map..."
        }));
        return;
    }

    return (
        <div className="z-[200] absolute">
            <div className="flex flex-col gap-2 p-1 bg-gray-700 rounded-md ml-2 mt-10 w-auto">
                <MapFeaturesToggleButton
                    onToggle={(activeFlag) => dispatch(toggleTrafficLayer(activeFlag))}
                    icon={<IoAirplane/>}
                    initialActive={trafficLayerVisible}
                />

                <MapFeaturesToggleButton
                    onToggle={(activeFlag) => dispatch(toggleAtcLayer(activeFlag))}
                    icon={<GiControlTower/>}
                    initialActive={allAtcLayerVisible}
                />

                <MapFeaturesToggleButton
                    onToggle={(activeFlag) => dispatch(toggleWeatherRasterLayer(activeFlag))}
                    icon={<TiWeatherDownpour/>}
                    initialActive={weatherRasterVisible}
                />

                <MapStyleToggleButton mapRef={mapRef}/>

                <MapFilterToggleButton mapRef={mapRef}/>

            </div>
        </div>
    );
};

export default TogglePanel;
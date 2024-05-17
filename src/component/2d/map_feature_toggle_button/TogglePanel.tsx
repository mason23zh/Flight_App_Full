import React, { useEffect, useState } from "react";
import MapFeaturesToggleButton from "./MapFeaturesToggleButton";
import { useDispatch, useSelector } from "react-redux";
import {
    addMessage,
    removeMessageByLocation,
    RootState,
    toggleAtcLayer, toggleTerrainLabel,
    toggleTrafficLayer,
    toggleWeatherRasterLayer
} from "../../../store";
import { IoAirplane } from "react-icons/io5";
import { TiWeatherDownpour } from "react-icons/ti";
import { GiControlTower } from "react-icons/gi";
import { CgTerrain } from "react-icons/cg";


import { MapRef } from "react-map-gl";
import MapStyleToggleButton from "./MapStyleToggleButton";
import MapFilterToggleButton from "./MapFilterToggleButton";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

const TogglePanel = ({ mapRef }: Props) => {
    const {
        allAtcLayerVisible,
        trafficLayerVisible,
        weatherRasterVisible,
        terrainEnable
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

    useEffect(() => {
        if (!isMapLoaded) {
            dispatch(addMessage({
                location: "BASE_MAP",
                messageType: "LOADING",
                content: "Loading map..."
            }));
        }
    }, [isMapLoaded, dispatch]);

    return (
        <div className="z-[200] absolute">
            <div className="flex flex-col gap-2 p-1 bg-gray-700 rounded-md ml-2 mt-10 w-auto">
                <MapFeaturesToggleButton
                    onToggle={(activeFlag) => dispatch(toggleTrafficLayer(activeFlag))}
                    icon={<IoAirplane/>}
                    initialActive={trafficLayerVisible}
                    tooltipMessage="Toggle Vatsim traffic"
                />

                <MapFeaturesToggleButton
                    onToggle={(activeFlag) => dispatch(toggleAtcLayer(activeFlag))}
                    icon={<GiControlTower/>}
                    initialActive={allAtcLayerVisible}
                    tooltipMessage="Toggle ATC visibility"
                />

                <MapFeaturesToggleButton
                    onToggle={(activeFlag) => dispatch(toggleWeatherRasterLayer(activeFlag))}
                    icon={<TiWeatherDownpour/>}
                    initialActive={weatherRasterVisible}
                    tooltipMessage="Toggle weather"
                />

                <MapFeaturesToggleButton
                    onToggle={(activeFlag) => dispatch(toggleTerrainLabel(activeFlag))}
                    icon={<CgTerrain/>}
                    initialActive={terrainEnable}
                    tooltipMessage="Toggle terrain and 3D view"
                />

                <MapStyleToggleButton mapRef={mapRef}/>

                <MapFilterToggleButton mapRef={mapRef}/>

            </div>
        </div>
    );
};

export default TogglePanel;
import React, { useEffect, useState } from "react";
import MapFeaturesToggleButton from "./MapFeaturesToggleButton";
import { useDispatch, useSelector } from "react-redux";
import {
    addMessage,
    removeMessageByLocation,
    RootState,
    toggleAtcLayer, toggleMapFollowTraffic,
    toggleMovingMap, toggleTelemetry,
    toggleTerrainLabel,
    toggleTrafficLayer,
    toggleWeatherRasterLayer
} from "../../../store";
import { IoAirplane } from "react-icons/io5";
import { TiWeatherDownpour } from "react-icons/ti";
import { GiControlTower } from "react-icons/gi";
import { CgTerrain } from "react-icons/cg";
import { MdNavigation } from "react-icons/md";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { IoSpeedometerOutline, IoSearchSharp } from "react-icons/io5";

import { MapRef } from "react-map-gl";
import MapStyleToggleButton from "./MapStyleToggleButton";
import MapFilterToggleButton from "./MapFilterToggleButton";
import useIsTouchScreen from "../../../hooks/useIsTouchScreen";
import { useWebSocketContext } from "../WebSocketContext";
import { toggleSearchBox } from "../../../store/slices/vatsimMapVisibleSlice";
import SearchButton from "./search_box/SearchButton";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

const TogglePanel = ({ mapRef }: Props) => {
    const {
        allAtcLayerVisible,
        trafficLayerVisible,
        weatherRasterVisible,
        terrainEnable,
        movingMap,
        mapFollowTraffic,
        displayTelemetry,
        searchBoxVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const {
        openWebSocket,
        closeWebSocket,
        liveTrafficAvailable
    } = useWebSocketContext();

    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const dispatch = useDispatch();


    const handleMovingMapIconToggle = (activeFlag) => {
        if (activeFlag) {
            openWebSocket();
            if (liveTrafficAvailable) {
                dispatch(toggleMovingMap(true));
            }
        } else {
            closeWebSocket();
            dispatch(toggleMovingMap(false));
        }
    };


    // Map loading state/error notification
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

    const parentStyle = "z-[200] absolute bottom-0 w-full sm:top-auto sm:left-0 " +
            "sm:bottom-auto sm:w-auto sm:right-auto";

    const childStyle = "flex flex-row items-center justify-center gap-2 p-1 bg-gray-700 " +
            "rounded-md sm:flex-col sm:items-start sm:ml-2 sm:mt-10 sm:justify-start";

    const isTouchScreen = useIsTouchScreen();

    return (
        <div className={parentStyle}>
            <div className="flex justify-center w-full sm:w-auto">
                <div className={childStyle}>

                    <SearchButton
                        tooltipMessage="TEST"
                        isTouchScreen={isTouchScreen}
                    />

                    <MapFeaturesToggleButton
                        onToggle={(activeFlag) => dispatch(toggleTrafficLayer(activeFlag))}
                        icon={<IoAirplane/>}
                        initialActive={trafficLayerVisible}
                        tooltipMessage="Toggle Vatsim traffic"
                        isTouchScreen={isTouchScreen}
                    />

                    <MapFeaturesToggleButton
                        onToggle={(activeFlag) => dispatch(toggleAtcLayer(activeFlag))}
                        icon={<GiControlTower/>}
                        initialActive={allAtcLayerVisible}
                        tooltipMessage="Toggle ATC visibility"
                        isTouchScreen={isTouchScreen}
                    />

                    <MapFeaturesToggleButton
                        onToggle={(activeFlag) => dispatch(toggleWeatherRasterLayer(activeFlag))}
                        icon={<TiWeatherDownpour/>}
                        initialActive={weatherRasterVisible}
                        tooltipMessage="Toggle weather"
                        isTouchScreen={isTouchScreen}
                    />

                    <MapFeaturesToggleButton
                        onToggle={(activeFlag) => dispatch(toggleTerrainLabel(activeFlag))}
                        icon={<CgTerrain/>}
                        initialActive={terrainEnable}
                        tooltipMessage="Toggle terrain and 3D view"
                        isTouchScreen={isTouchScreen}
                    />

                    <MapFeaturesToggleButton
                        onToggle={handleMovingMapIconToggle}
                        icon={<MdNavigation/>}
                        initialActive={movingMap}
                        tooltipMessage="Enable moving map"
                        isTouchScreen={isTouchScreen}
                    />

                    {(movingMap && liveTrafficAvailable) &&
                        <>
                            <MapFeaturesToggleButton
                                onToggle={(activeFlag) => dispatch(toggleMapFollowTraffic(activeFlag))}
                                icon={<FaLocationCrosshairs/>}
                                initialActive={mapFollowTraffic}
                                tooltipMessage="Map follow traffic"
                                isTouchScreen={isTouchScreen}
                            />

                            <MapFeaturesToggleButton
                                onToggle={(activeFlag) => dispatch(toggleTelemetry(activeFlag))}
                                icon={<IoSpeedometerOutline/>}
                                initialActive={displayTelemetry}
                                tooltipMessage="Toggle traffic telemtry"
                                isTouchScreen={isTouchScreen}
                            />
                        </>
                    }

                    <MapStyleToggleButton mapRef={mapRef} isTouchScreen={isTouchScreen}/>

                    <MapFilterToggleButton mapRef={mapRef} isTouchScreen={isTouchScreen}/>

                </div>
            </div>
        </div>
    );
};

export default TogglePanel;
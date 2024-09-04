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
import { IoSpeedometerOutline } from "react-icons/io5";
import { useMap } from "react-map-gl";
import MapStyleToggleButton from "./MapStyleToggleButton";
import MapFilterToggleButton from "./MapFilterToggleButton";
import useIsTouchScreen from "../../../hooks/useIsTouchScreen";
import { useWebSocketContext } from "../WebSocketContext";
import SearchButton from "./search_box/SearchButton";
import mapboxgl from "mapbox-gl";


const TogglePanel = () => {
    const { current: mapRef } = useMap();
    const {
        allAtcLayerVisible,
        trafficLayerVisible,
        weatherRasterVisible,
        terrainEnable,
        movingMap,
        mapFollowTraffic,
        displayTelemetry,
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

    //TODO: issue adding and removing terrain.
    useEffect(() => {
        const map = mapRef?.getMap();
        if (!map) return;

        const addTerrainSource = (map: mapboxgl.Map) => {
            map.addSource("mapbox-dem", {
                "type": "raster-dem",
                "url": "mapbox://mapbox.mapbox-terrain-dem-v1",
                "tileSize": 512,
                "maxzoom": 14
            });
            // add the DEM source as a terrain layer with exaggerated height
            map.setTerrain({
                "source": "mapbox-dem",
                "exaggeration": 1.5
            });
        };

        const addTerrainLayer = () => {
            try {
                addTerrainSource(map);
            } catch (e) {
                map.on("style.load", () => {
                    addTerrainSource(map);
                });
            }
        };

        const removeTerrainLayer = () => {
            map.setPitch(0);
            map.setBearing(0);

            // Remove terrain first if it exists
            if (map.getTerrain()) {
                map.setTerrain(null);
            }

            // Remove the source after terrain has been removed
            // if (map.getSource("mapbox-dem")) {
            //     map.removeSource("mapbox-dem");
            // }
        };

        if (terrainEnable) {
            addTerrainLayer();
        } else {
            removeTerrainLayer();
        }

        return () => {
            removeTerrainLayer();
        };

    }, [terrainEnable, mapRef]);


    // Map loading state/error notification
    useEffect(() => {
        // const map = mapRef.current?.getMap();
        if (!mapRef) {
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

        mapRef.on("load", handleMapLoad);

        return () => {
            mapRef.off("load", handleMapLoad);
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
                        tooltipMessage="Search"
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

                    <MapStyleToggleButton isTouchScreen={isTouchScreen}/>

                    <MapFilterToggleButton isTouchScreen={isTouchScreen}/>

                </div>
            </div>
        </div>
    );
};

export default TogglePanel;
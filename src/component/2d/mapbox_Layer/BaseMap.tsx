import React, { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { Map, NavigationControl, Source } from "react-map-gl";
import useAirportsLayers from "../../../hooks/useAirportsLayers";
import TogglePanel from "../map_feature_toggle_button/TogglePanel";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setAirportTracking, setTrafficTracking } from "../../../store";
import { useWebSocketContext } from "../WebSocketContext";
import TelemetryPanel from "../LocalUserTraffic_Layer/TelemetryPanel";
import { VatsimFlight } from "../../../types";
import { ViewStateProvider } from "../viewStateContext";
import { DomEvent } from "leaflet";
import preventDefault = DomEvent.preventDefault;


export interface Viewport {
    longitude: number;
    latitude: number;
    zoom: number;
    width: number;
    height: number;
    pitch: number;
    bearing: number;
}


interface BaseMapProps {
    children: React.ReactNode;
}

const BaseMap = ({ children }: BaseMapProps) => {
    const mapRef = useRef(null);
    // const mapContainerRef = document.getElementById("mainMap").client;
    const [navigationPosition, setNavigationPosition] = useState<"bottom-left" | "top-left">("bottom-left");
    const dispatch = useDispatch();

    const {
        flightData,
        liveTrafficAvailable
    } = useWebSocketContext();

    const {
        terrainEnable,
        mapFollowTraffic,
        movingMap,
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const { tracking: trafficTracking } = useSelector((state: RootState) => state.flightInfo);
    const {
        tracking: airportTracking,
        selectedAirport: mapSearchSelectedAirport
    }
            = useSelector((state: RootState) => state.mapSearchAirport);

    const traffic = useSelector<RootState, VatsimFlight>(
        state => state.vatsimMapTraffic.selectedTraffic || null);


    // Default view point
    const [viewState, setViewState] = useState({
        longitude: -29.858598,
        latitude: 36.15178,
        zoom: 2.7,
        pitch: 0,
        bearing: 0,
        width: 0,
        height: 0
    });

    // To move the map view to the tracked traffic
    useEffect(() => {
        if (trafficTracking && traffic) {
            setViewState((prevState) => ({
                ...prevState,
                zoom: 10.0,
                longitude: traffic.longitude,
                latitude: traffic.latitude
            }));
            dispatch(setTrafficTracking(false));
        }

        if (airportTracking && mapSearchSelectedAirport) {
            const lng = Number(mapSearchSelectedAirport.coordinates.split(",")[0]);
            const lat = Number(mapSearchSelectedAirport.coordinates.split(",")[1]);
            setViewState((prevState) => ({
                ...prevState,
                zoom: 13.0,
                longitude: lng,
                latitude: lat
            }));
            dispatch(setAirportTracking(false));
        }

    }, [trafficTracking, traffic, airportTracking, mapSearchSelectedAirport]);

    // To make map view to follow local user traffic
    useEffect(() => {
        if (movingMap &&
                liveTrafficAvailable &&
                mapFollowTraffic &&
                flightData.latitude &&
                flightData.longitude) {
            setViewState((prevState) => ({
                ...prevState,
                longitude: flightData.longitude,
                latitude: flightData.latitude,
            }));
        }
    }, [flightData, mapFollowTraffic]);

    // This will ensure that the pitch and bearing is set to 0 when terrain is disabled
    useEffect(() => {
        if (!terrainEnable) {
            setViewState(currentState => ({
                ...currentState,
                pitch: 0,
                bearing: 0
            }));
        }
    }, [terrainEnable]);


    const [mapStyle, setMapStyle] = useState<CSSProperties>({
        height: "100%", // Default style
        width: "100%",
        position: "absolute"
    });

    const { airportLayers: AirportLayers } = useAirportsLayers();

    // Change navigation position based on the screen size when component mounted
    useEffect(() => {
        const mapElement = document.getElementById("mainMap");
        //640px is the value for tailwind to switch to 'sm' view
        if (mapElement && mapElement.clientWidth <= 640) {
            setNavigationPosition("top-left");
        } else {
            setNavigationPosition("bottom-left");
        }
    }, []);


    // adjust map height
    useEffect(() => {
        const navbarHeight = document.querySelector(".main-navbar").clientHeight;
        const mapHeight = `calc(100dvh - ${navbarHeight}px)`;
        setMapStyle(prevStyle => ({
            ...prevStyle,
            height: mapHeight
        }));
    }, []);

    // set map width and height in the viewState when component mount
    useEffect(() => {
        const mapElement = document.getElementById("mainMap");
        if (mapElement && mapRef.current) {
            const mapHeight = mapElement.clientHeight || 0;
            const mapWidth = mapElement.clientWidth || 0;
            setViewState((prevState) => ({
                ...prevState,
                width: mapWidth,
                height: mapHeight
            }));
        }
    }, [mapRef.current]);

    // change map view, update map height and width
    const onMove = useCallback(({ viewState }) => {
        const mapElement = document.getElementById("mainMap");
        const mapHeight = mapElement?.clientHeight || 0;
        const mapWidth = mapElement?.clientWidth || 0;
        setViewState({
            longitude: viewState.longitude,
            latitude: viewState,
            height: mapHeight,
            width: mapWidth,
            ...viewState
        });
    }, []);


    const initializeTerrainSource = useCallback((map) => {
        if (!terrainEnable) {
            map.setTerrain(undefined);
            return;
        }

        if (!map.getSource("mapbox-dem")) {
            map.addSource("mapbox-dem", {
                type: "raster-dem",
                url: "mapbox://mapbox.mapbox-terrain-dem-v1",
                tileSize: 512,
                maxzoom: 14
            });
        }

        map.setTerrain({
            source: "mapbox-dem",
            exaggeration: 1.5
        });
    }, [terrainEnable]);

    // To initialize the terrain mode when map load
    // if terrain is enabled
    useEffect(() => {
        const map = mapRef.current?.getMap();
        if (map) {
            initializeTerrainSource(map);
        }
    }, [initializeTerrainSource]);

    // To remove the terrain if mode switch to 2d
    useEffect(() => {
        const map = mapRef.current?.getMap();
        if (map && !terrainEnable && map.getSource("mapbox-dem")) {
            map.setTerrain(undefined);
            map.removeSource("mapbox-dem");
        }
    }, [terrainEnable]);


    /*
    * Default Projection: mercator
    * Unable to use globe as Projection due to mapbox api limitation.
    * ViewStateProvider will pass the viewState to BaseTrafficLayer,
    * the viewState will help filter out the traffic that not within the viewport.
    */
    return (
        <ViewStateProvider value={viewState}>
            <div onContextMenu={evt => evt.preventDefault()}>
                <Map
                    id="mainMap"
                    ref={mapRef}
                    projection={{ name: "mercator" }}
                    cursor={"auto"}
                    // to reset the pitch and bearing
                    {...viewState}
                    dragRotate={terrainEnable}
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                    mapStyle={import.meta.env.VITE_MAPBOX_MAIN_STYLE}
                    initialViewState={viewState}
                    maxPitch={70}
                    style={mapStyle}
                    onMove={onMove}
                    dragPan={true}
                    onLoad={(e) => initializeTerrainSource(e.target)}
                    logoPosition={"bottom-right"}
                >
                    {terrainEnable &&
                        <Source
                            id="mapbox-dem"
                            type="raster-dem"
                            url="mapbox://mapbox.mapbox-terrain-dem-v1"
                            tileSize={512}
                            maxzoom={14}
                        />
                    }
                    <TogglePanel mapRef={mapRef}/>
                    <TelemetryPanel/>
                    <NavigationControl position={navigationPosition}/>
                    {AirportLayers}
                    {children}
                </Map>
            </div>
        </ViewStateProvider>
    );
};

export default React.memo(BaseMap);
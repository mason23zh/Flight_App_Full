import React, { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { Map, NavigationControl, Source } from "react-map-gl";
import useAirportsLayers from "../../../hooks/useAirportsLayers";
import TogglePanel from "../map_feature_toggle_button/TogglePanel";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useWebSocketContext } from "../WebSocketContext";
import TelemetryPanel from "../LocalUserTraffic_Layer/TelemetryPanel";

const BaseMap = ({ children }) => {
    const mapRef = useRef(null);

    const {
        flightData,
        liveTrafficAvailable
    } = useWebSocketContext();

    const {
        terrainEnable,
        mapFollowTraffic,
        movingMap,
    } = useSelector((state: RootState) => state.vatsimMapVisible);


    // Default view point
    const [viewState, setViewState] = useState({
        longitude: -29.858598,
        latitude: 36.15178,
        zoom: 2.7,
        pitch: 0,
        bearing: 0,
    });

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

    useEffect(() => {
        const navbarHeight = document.querySelector(".main-navbar").clientHeight;
        const mapHeight = `calc(100dvh - ${navbarHeight}px)`;
        setMapStyle(prevStyle => ({
            ...prevStyle,
            height: mapHeight
        }));
    }, []);


    const onMove = useCallback(({ viewState }) => {
        setViewState({
            longitude: viewState.longitude,
            latitude: viewState,
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
    * Unable to use globe as Projection due to mapbox api limitation
    */
    return (
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
                <NavigationControl position="bottom-left"/>
                {AirportLayers}
                {children}
            </Map>
        </div>
    );
};

export default React.memo(BaseMap);
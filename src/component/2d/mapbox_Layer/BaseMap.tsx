import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { Map, MapProvider, MapRef } from "react-map-gl";
import useAirportsLayers from "../../../hooks/useAirportsLayers";
import TogglePanel from "../map_feature_toggle_button/TogglePanel";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import TelemetryPanel from "../LocalUserTraffic_Layer/TelemetryPanel";
import { useInitializeDatabase } from "../../../hooks/useInitializeDatabase";
import GeneralLoading from "../../GeneralLoading";
import { useTheme } from "../../../hooks/ThemeContext";
import CustomNavigationController from "../CustomNavigationController";
import mapboxgl from "mapbox-gl";
import VatsimTrafficLayer from "../globe_projection/Vatsim_Traffic_Layer/VatsimTrafficLayer";

interface BaseMapProps {
    children: React.ReactNode;
}

const BaseMap = ({ children }: BaseMapProps) => {
    const mapRef = useRef<MapRef | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const darkMode = useTheme();
    const isDatabaseInitialized = useInitializeDatabase();

    const {
        terrainEnable,
        mapProjection
    } = useSelector((state: RootState) => state.vatsimMapVisible);


    // Default view point
    const [viewState, setViewState] = useState({
        longitude: -29.858598,
        latitude: 36.15178,
        zoom: 2.7,
        pitch: 0,
        bearing: 0,
        width: 0,
        height: 0,
    });


    const [mapStyle, setMapStyle] = useState<CSSProperties>({
        height: "100%", // Default style
        width: "100%",
        position: "absolute"
    });

    const { airportLayers: AirportLayers } = useAirportsLayers();


    useEffect(() => {
        if (mapRef && mapRef?.current) {
            const map = mapRef.current.getMap();
            setMap(map);
        }
    }, [mapRef, mapProjection]);

    // Manually trigger the resize to avoid dimension calculation error
    useEffect(() => {
        if (mapRef && mapRef?.current) {
            mapRef.current.resize();
        }
    }, [mapStyle, mapRef]);

    useEffect(() => {
        if (map) {
            map.on("error", () => {
                console.error("Error loading map");
            });

            map.on("webglcontextlost", () => {
                console.error("WebGL context lost");
            });

            if (!mapboxgl.supported()) {
                console.error("MapboxGL not supported");
            }
        }

    }, [map]);

    // adjust map height
    useEffect(() => {
        const updateMapHeight = () => {
            const navbarHeight = document.querySelector(".main-navbar")?.clientHeight || 0;
            const mapHeight = `calc(100dvh - ${navbarHeight}px)`;
            setMapStyle(prevStyle => ({
                ...prevStyle,
                height: mapHeight
            }));
        };

        updateMapHeight();
        window.addEventListener("resize", updateMapHeight);

        return () => {
            window.removeEventListener("resize", updateMapHeight);
        };
    }, []);


    if (!isDatabaseInitialized) {
        return <GeneralLoading themeMode={darkMode ? "dark" : "light"}/>;
    }

    /*
    * Default Projection: mercator
    * Unable to use globe as Projection due to mapbox api limitation.
    */
    return (
        <MapProvider>
            <div
                onContextMenu={evt => evt.preventDefault()}
            >
                <Map
                    ref={mapRef}
                    id="mainMap"
                    projection={{ name: mapProjection }}
                    // cursor={"auto"}
                    // if minZoom is lower than the 1.9, the longitudeWrapping function will be bugged
                    // Set 1.92 for safe
                    minZoom={1.92}
                    dragRotate={terrainEnable}
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                    mapStyle={import.meta.env.VITE_MAPBOX_MAIN_STYLE}
                    initialViewState={viewState}
                    maxPitch={70}
                    style={mapStyle}
                    dragPan={true}
                    renderWorldCopies={true} //prevent map wrapping
                    logoPosition={"bottom-right"}
                >
                    <TogglePanel/>
                    <TelemetryPanel/>
                    <CustomNavigationController/>
                    {AirportLayers}
                    {children}
                </Map>
            </div>
        </MapProvider>
    );
};

export default React.memo(BaseMap);
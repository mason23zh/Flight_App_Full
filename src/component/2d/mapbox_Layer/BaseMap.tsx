import React, { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { Map, NavigationControl, Source, MapProvider } from "react-map-gl";
import useAirportsLayers from "../../../hooks/useAirportsLayers";
import TogglePanel from "../map_feature_toggle_button/TogglePanel";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setAirportTracking, setTrafficTracking } from "../../../store";
import { useWebSocketContext } from "../WebSocketContext";
import TelemetryPanel from "../LocalUserTraffic_Layer/TelemetryPanel";
import { VatsimFlight } from "../../../types";

interface BaseMapProps {
    children: React.ReactNode;
}

const BaseMap = ({ children }: BaseMapProps) => {
    // const localMapRef = useRef<ExtendedMapRef | null>(null);
    // const mapContainerRef = document.getElementById("mainMap").client;
    const [navigationPosition, setNavigationPosition] = useState<"bottom-left" | "top-left">("bottom-left");

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
        width: 0,
        height: 0,
    });


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


    const [mapStyle, setMapStyle] = useState<CSSProperties>({
        height: "100%", // Default style
        width: "100%",
        position: "absolute"
    });

    const { airportLayers: AirportLayers } = useAirportsLayers();

    // Change navigation position based on the screen size when component mounted
    useEffect(() => {
        const updateNavigationPosition = () => {
            const mapElement = document.getElementById("mainMap");
            if (mapElement && mapElement.clientWidth <= 640) {
                setNavigationPosition("top-left");
            } else {
                setNavigationPosition("bottom-left");
            }
        };

        updateNavigationPosition();
        window.addEventListener("resize", updateNavigationPosition);

        return () => {
            window.removeEventListener("resize", updateNavigationPosition);
        };
    }, []);


    // adjust map height
    useEffect(() => {
        const updateMapHeight = () => {
            const navbarHeight = document.querySelector(".main-navbar")?.clientHeight || 0;
            const mapHeight = `calc(100vh - ${navbarHeight}px)`;
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


    /*
    * Default Projection: mercator
    * Unable to use globe as Projection due to mapbox api limitation.
    * ViewStateProvider will pass the viewState to BaseTrafficLayer,
    * the viewState will help filter out the traffic that not within the viewport.
    */
    return (
        <MapProvider>
            <div
                onContextMenu={evt => evt.preventDefault()}
            >
                <Map
                    id="mainMap"
                    projection={{ name: "mercator" }}
                    cursor={"auto"}
                    // if minZoom is lower than the 1.9, the longitudeWrapping function will be bugged
                    minZoom={1.9}
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
                    <NavigationControl position={navigationPosition}/>
                    {AirportLayers}
                    {children}
                </Map>
            </div>
        </MapProvider>
    );
};

export default React.memo(BaseMap);
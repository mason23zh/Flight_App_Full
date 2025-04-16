import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { Map, MapLayerMouseEvent, MapProvider, MapRef } from "react-map-gl";
import useAirportsLayers from "../../../hooks/useAirportsLayers";
import TogglePanel from "../map_feature_toggle_button/TogglePanel";
import { useDispatch, useSelector } from "react-redux";
import {
    closeTrafficDetail,
    openTrafficDetail,
    RootState, setHoveredController, setHoveredFir, setHoveredTracon,
    setSelectedTraffic
} from "../../../store";
import TelemetryPanel from "../LocalUserTraffic_Layer/TelemetryPanel";
import { useInitializeDatabase } from "../../../hooks/useInitializeDatabase";
import GeneralLoading from "../../GeneralLoading";
import { useTheme } from "../../../hooks/ThemeContext";
import CustomNavigationController from "../CustomNavigationController";
import mapboxgl from "mapbox-gl";
import { AirportService, Service, VatsimFlight, VatsimFlightPlan } from "../../../types";
import { MatchedFir } from "../../../hooks/useMatchedFirs";
import BaseMapPopups from "../globe_projection/BaseMapPopups";
import { setHoveredTraffic } from "../../../store/slices/mapLayerHoverSlice";
import { HoverTracon, HoverTraconControllers } from "./Tracon_Layers/TraconLabelPopup";
import {
    GLOBE_CONTROLLER_ICON_LAYER_ID,
    GLOBE_FIR_ICON_LAYER_ID, GLOBE_TRACON_ICON_LAYER_ID,
    GLOBE_TRAFFIC_ICON_LAYER_ID
} from "../globe_projection/layerSourceName";

//TODO: mapboxgl tooltip arrow remove
//TODO: Globe projection layer order issue.
//TODO: Globe projection traffic not render when first load.
//TODO: !important! use redux to move the useState to prevent re-render
interface BaseMapProps {
    children: React.ReactNode;
}

const BaseMap = ({ children }: BaseMapProps) => {
    // const [cursor, setCursor] = useState<string>("grab");
    const [isLoaded, setIsLoaded] = useState(false);
    // const [isStyleLoaded, setIsStyleLoaded] = useState(false);
    const popupRef = useRef<mapboxgl.Popup>();

    const dispatch = useDispatch();
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
        // width: "100%",
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

    // useEffect(() => {
    //     if (map) {
    //         const handleStyleData = () => {
    //             console.log("style load");
    //             setIsStyleLoaded(true);
    //         };
    //
    //         map.on("styledata", handleStyleData);
    //
    //         return () => {
    //             map.off("styledata", handleStyleData);
    //         };
    //     }
    // }, [map]);

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

    useEffect(() => {
        popupRef.current?.trackPointer();
        popupRef.current?.addClassName("p-0");
    }, [popupRef.current]);


    if (!isDatabaseInitialized) {
        return <GeneralLoading themeMode={darkMode ? "dark" : "light"}/>;
    }

    // This onClick event handler will handle click events for the globe VatsimTrafficLayer
    const handleOnClick = (e: MapLayerMouseEvent) => {
        if (!e.features || e.features.length === 0 && mapProjection === "globe") {
            dispatch(setSelectedTraffic(null));
            dispatch(closeTrafficDetail());
            return;
        }
        e.features.forEach((feature) => {
            const layerId = feature.layer.id;

            if (layerId === "vatsim-traffic-globe-layer") {
                // Workaround for GeoJSON serializes nested object
                const properties = feature.properties as Omit<VatsimFlight, "flight_plan"> & {
                    flight_plan: string | null
                };
                const trafficData: VatsimFlight = {
                    ...properties,
                    flight_plan: properties.flight_plan
                        ? JSON.parse(properties.flight_plan) as VatsimFlightPlan
                        : null
                };

                dispatch(setSelectedTraffic(trafficData));
                dispatch(openTrafficDetail());
            }
        });

    };

    const handleHover = (e: MapLayerMouseEvent) => {
        if (!e.features || e.features.length === 0) {
            dispatch(setHoveredTraffic(null));
            dispatch(setHoveredController(null));
        }
        e.features.forEach((feature) => {
            const layerId = feature.layer.id;

            if (layerId === GLOBE_TRAFFIC_ICON_LAYER_ID) {
                // setCursor("pointer");
                const properties = feature.properties as Omit<VatsimFlight, "flight_plan"> & {
                    flight_plan: string | null
                };

                const trafficData: VatsimFlight = {
                    ...properties,
                    flight_plan: properties.flight_plan
                        ? JSON.parse(properties.flight_plan) as VatsimFlightPlan
                        : null
                };

                dispatch(setHoveredTraffic({
                    info: trafficData,
                    x: e.point.x,
                    y: e.point.y
                }));
            }

            if (layerId === GLOBE_CONTROLLER_ICON_LAYER_ID) {
                // setCursor("pointer");
                const properties = feature.properties as Omit<AirportService, "services" | "coordinates"> & {
                    coordinates: string | null;
                    services: string | null;
                };

                const controllerServiceData: AirportService = {
                    ...properties,
                    coordinates: properties.coordinates
                        ? JSON.parse(properties.coordinates) as string []
                        : [],
                    services: properties.services
                        ? JSON.parse(properties.services) as Array<Service>
                        : []
                };

                dispatch(setHoveredController(controllerServiceData));
            }

            if (layerId === GLOBE_FIR_ICON_LAYER_ID) {
                // setCursor("pointer");
                const properties = feature.properties as Omit<MatchedFir, "firInfo" | "controller"> & {
                    controllers: string | null;
                    firInfo: string | null
                };

                const firData: MatchedFir = {
                    ...properties,
                    controllers: properties.controllers
                        ? JSON.parse(properties.controllers)
                        : {},
                    firInfo: properties.firInfo
                        ? JSON.parse(properties.firInfo)
                        : []
                };

                // setHoveredFir(firData);
                dispatch(setHoveredFir(firData));
            }

            if (layerId === GLOBE_TRACON_ICON_LAYER_ID) {
                // setCursor("pointer");
                //TODO: Fix typescript issues for hovered tracon properties
                const properties = feature.properties as Omit<HoverTracon, "controllers" | "traconInfo"> & {
                    controllers: string | null;
                    traconInfo: string | null
                };

                const traconData: HoverTracon = {
                    ...properties,
                    controllers: properties.controllers
                        ? JSON.parse(properties.controllers)
                        : {},
                    traconInfo: properties.traconInfo
                        ? JSON.parse(properties.traconInfo)
                        : {}
                };

                // setHoveredTracon(traconData);
                dispatch(setHoveredTracon(traconData));
                // console.log("tracon properties:", traconData);
            }
        });
    };


    const handleMouseLeave = () => {
        // setCursor("grab");
        // setShowPopup(false);
        dispatch(setHoveredTraffic(null));
        dispatch(setHoveredController(null));
        dispatch(setHoveredTracon(null));
        dispatch(setHoveredFir(null));
    };

    /*
    * Default Projection: mercator
    * Unable to use globe as Projection due to mapbox api limitation.
    */
    return (
        <MapProvider>
            <div
                onContextMenu={evt => evt.preventDefault()}
            >
                {
                    !isLoaded && (
                        <div>
                            loading map...
                        </div>
                    )
                }
                <Map
                    ref={mapRef}
                    id="mainMap"
                    projection={{ name: mapProjection }}
                    // projection={{ name: "globe" }}
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
                    renderWorldCopies={false} //prevent map wrapping
                    logoPosition={"bottom-right"}
                    interactiveLayerIds={
                        [
                            "vatsim-traffic-globe-layer",
                            "controller-icon-globe-layer",
                            "fir-icon-globe-layer",
                            "tracon-icon-globe-layer"
                        ]
                    }
                    onClick={(e) => handleOnClick(e)}
                    onMouseEnter={(e) => handleHover(e)}
                    onMouseLeave={handleMouseLeave}
                    // cursor={cursor}
                    onLoad={() => {
                        console.log("Map done loading.");
                        setIsLoaded(true);
                    }}
                    // onRender={(event) => event.target.resize()}
                    reuseMaps={true}
                    optimizeForTerrain={terrainEnable}
                    preserveDrawingBuffer={false}
                    antialias={false}
                    trackResize={false}
                    maxTileCacheSize={25}
                    // cooperativeGestures={true}
                >
                    {isLoaded && (
                        <>
                            <BaseMapPopups/>
                            <TogglePanel/>
                            <TelemetryPanel/>
                            <CustomNavigationController/>
                            {AirportLayers}
                            {children}
                        </>
                    )}
                </Map>
            </div>
        </MapProvider>
    );
};

export default React.memo(BaseMap);
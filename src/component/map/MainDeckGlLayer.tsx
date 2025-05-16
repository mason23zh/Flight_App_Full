/**
 * Use to render the DeckGL overlay
 * */
import { useCallback, useEffect, useMemo, useState } from "react";
import { WebMercatorViewport } from "@deck.gl/core/typed";
import DeckGlOverlay from "./deckGL_Layer/DeckGLOverlay";
import { VatsimControllers, VatsimFlight } from "../../types";
import { PickingInfo } from "@deck.gl/core/typed";
import {
    addMessage,
    removeMessageByLocation,
    useFetchTrafficTrackDataQuery,
    setSelectedTraffic,
    RootState,
    closeTrafficDetail,
    openTrafficDetail,
} from "../../store";
import { useDispatch, useSelector } from "react-redux";
import useIsTouchScreen from "../../hooks/useIsTouchScreen";
import { useWebSocketContext } from "./WebSocketContext";
import filterTrafficDataInViewport from "./filterTrafficDataInViewport";
import { useMap } from "react-map-gl";
import ControllerMarkerPopup from "./mapbox_Layer/Controller_Markers_Layer/ControllerMarkerPopup";
import TraconLabelPopup from "./mapbox_Layer/Tracon_Layers/TraconLabelPopup";
import FirLabelPopup from "./mapbox_Layer/FIR_Layers/FirLabelPopup";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import useFirIconLayer from "../../hooks/useFirIconLayer";
import useTraconIconLayer from "../../hooks/useTraconIconLayer";
import useControllerIconLayer from "../../hooks/useControllerIconLayer";
import mapboxgl from "mapbox-gl";
import useFlightPathLayer from "../../hooks/useFlightPathLayer";
import useTrafficLayer2D from "../../hooks/useTrafficLayer2D";
import useTrafficLayer3D from "../../hooks/useTrafficLayer3D";
import useLocalTrackFlightLayer from "../../hooks/useLocalTrackFlightLayer";
import { debounce, throttle } from "lodash";
import HoveredTrafficTooltip from "./HoveredTrafficTooltip";
import {
    MERCATOR_CONTROLLER_ICON_LAYER_ID,
    MERCATOR_FIR_ICON_LAYER_ID,
    MERCATOR_TRACON_ICON_LAYER_ID,
    MERCATOR_TRAFFIC_LAYER_2D_ID,
    MERCATOR_TRAFFIC_LAYER_3D_ID,
} from "./deckGL_Layer/mercatorLayerNames";

// import useTrafficCallsignLayer from "../../hooks/useTrafficCallsignLayer";

interface MainTrafficLayerProps {
    vatsimPilots: Array<VatsimFlight>;
    controllerData: VatsimControllers;
    controllerDataLoading: boolean;
    controllerDataError: FetchBaseQueryError | SerializedError;
    movingMap: boolean;
    trafficLayerVisible: boolean;
}

interface PickedTraffic extends PickingInfo {
    object?: VatsimFlight | null;
}

// TODO: error handle
//TODO: Selected traffic state might be redundent
const MainDeckGlLayer = ({
    vatsimPilots,
    controllerData,
    controllerDataError,
    controllerDataLoading,
    trafficLayerVisible,
    movingMap,
}: MainTrafficLayerProps) => {
    const isTouchScreen = useIsTouchScreen();
    const dispatch = useDispatch();
    const { current: mapRef } = useMap();

    const [cursor, setCursor] = useState("grab");
    const [hoveredTraffic, setHoveredTraffic] = useState<PickingInfo | null>(null);
    const [selectTraffic, setSelectTraffic] = useState<VatsimFlight | null>(null);
    const { terrainEnable, mapFollowTraffic } = useSelector(
        (state: RootState) => state.vatsimMapVisible
    );
    const { allAtcLayerVisible } = useSelector((state: RootState) => state.vatsimMapVisible);

    const { selectedTraffic: mapSearchSelectedTraffic } = useSelector(
        (state: RootState) => state.mapSearchTraffic
    );

    const [currentViewBounds, setCurrentViewBounds] = useState<
        [number, number, number, number] | null
    >(null);

    const { flightData } = useWebSocketContext();

    const [map, setMap] = useState<mapboxgl.Map | null>(null);

    const {
        matchedFirs,
        hoveredFir,
        isError: errorMatchedFirs,
    } = useSelector((state: RootState) => state.matchedFirs);

    const {
        matchedFallbackTracons,
        matchedTracons,
        hoveredTracon,
        isLoading: isTraconLoading,
        isError: isTraconError,
    } = useSelector((state: RootState) => state.matchedTracons);

    const { hoveredController } = useSelector((state: RootState) => state.matchedControllers);

    const getViewPort = (map: mapboxgl.Map) => {
        //Need to check canvas here, because the canvas will be gone after Map unmount.
        if (!map || !map?.getCanvas()) return null;
        const viewport = new WebMercatorViewport({
            longitude: map.getCenter().lng,
            latitude: map.getCenter().lat,
            zoom: map.getZoom(),
            width: map.getCanvas().width,
            height: map.getCanvas().height,
        });
        return viewport.getBounds(); // [west, south, east, north]
    };

    const handleMapMovementEnd = () => {
        if (map) {
            const bounds = getViewPort(map);
            setCurrentViewBounds(bounds);
        }
    };

    useEffect(() => {
        if (mapRef) {
            const map = mapRef?.getMap();
            setMap(map);
        }
    }, [mapRef]);

    useEffect(() => {
        if (map) {
            const bounds = getViewPort(map);
            setCurrentViewBounds(bounds);
        }
    }, [map]);

    useEffect(() => {
        if (map) {
            // map.on("dragend", handleMapMovementEnd);
            // map.on("zoomend", handleMapMovementEnd);
            map.on("moveend", handleMapMovementEnd);
        }
        return () => {
            if (map) {
                // map.off("dragend", handleMapMovementEnd);
                // map.off("zoomend", handleMapMovementEnd);
                map.off("moveend", handleMapMovementEnd);
            }
        };
    }, [map]);

    const {
        data: trackData,
        error: trackError,
        isLoading: trackLoading,
    } = useFetchTrafficTrackDataQuery(selectTraffic?.callsign ?? "", {
        skip: !selectTraffic,
    });

    const filteredTrafficData = useMemo(() => {
        if (!currentViewBounds || !vatsimPilots || vatsimPilots.length === 0) return [];
        return filterTrafficDataInViewport(vatsimPilots, currentViewBounds);
    }, [currentViewBounds, vatsimPilots]);

    useEffect(() => {
        if (movingMap && flightData && mapFollowTraffic) {
            if (map) {
                const position = [flightData?.longitude, flightData?.latitude] as [number, number];
                map.easeTo({ center: position });
            }
        }
    }, [movingMap, flightData, terrainEnable, map, mapFollowTraffic]);

    useEffect(() => {
        setSelectTraffic(null);
    }, []);

    // This useEffect will display the FlightInfo panel to the
    // traffic that selected via the search box
    useEffect(() => {
        if (mapSearchSelectedTraffic) {
            setSelectTraffic(mapSearchSelectedTraffic);
            dispatch(setSelectedTraffic(mapSearchSelectedTraffic));
        } else {
            setSelectTraffic(null);
            dispatch(setSelectedTraffic(mapSearchSelectedTraffic));
        }
    }, [mapSearchSelectedTraffic]);

    const debouncedErrorDispatch = debounce(() => {
        dispatch(
            addMessage({
                location: "MAIN_DECK_GL",
                messageType: "ERROR",
                content: "Error loading map features",
            })
        );
    }, 800); // 800ms delay before dispatching error message

    useEffect(() => {
        const isLoading = trackLoading || isTraconLoading || controllerDataLoading;
        const isError =
            Boolean(trackError) ||
            Boolean(controllerDataError) ||
            errorMatchedFirs ||
            isTraconError;

        if (isError) {
            debouncedErrorDispatch();
        } else {
            debouncedErrorDispatch.cancel();
            dispatch(removeMessageByLocation({ location: "MAIN_DECK_GL" }));
        }

        if (isLoading) {
            dispatch(
                addMessage({
                    location: "MAIN_DECK_GL",
                    messageType: "LOADING",
                    content: "Loading map features",
                })
            );
        } else {
            dispatch(removeMessageByLocation({ location: "MAIN_DECK_GL" }));
        }

        // Cleanup function
        return () => {
            debouncedErrorDispatch.cancel(); // Cancel debounced function on cleanup
        };
    }, [
        trackError,
        trackLoading,
        controllerDataError,
        controllerDataLoading,
        errorMatchedFirs,
        isTraconLoading,
        isTraconError,
    ]);

    const deckOnClick = useCallback(
        (info: PickedTraffic) => {
            if (
                info.layer &&
                (info.layer.id === MERCATOR_TRAFFIC_LAYER_2D_ID ||
                    info.layer.id === MERCATOR_TRAFFIC_LAYER_3D_ID) &&
                info.object &&
                (!selectTraffic || info.object.callsign !== selectTraffic.callsign)
            ) {
                setSelectTraffic(info.object);
                dispatch(setSelectedTraffic(info.object));
                // dispatch(setAirportDepartureArrivalDisplay(false));
                dispatch(openTrafficDetail());
            } else if (!info.layer || !info.object) {
                dispatch(setSelectedTraffic(null)); //dispatch null would close the FlightInfo Panel
                dispatch(closeTrafficDetail());
                setSelectTraffic(null);
            }
        },
        [selectTraffic]
    );

    const firIconLayer = useFirIconLayer(matchedFirs, allAtcLayerVisible);
    const traconIconLayer = useTraconIconLayer(
        matchedTracons,
        matchedFallbackTracons,
        allAtcLayerVisible
    );
    const controllerIconLayer = useControllerIconLayer(controllerData, allAtcLayerVisible);
    const trackLayer = useFlightPathLayer(
        trackData?.data,
        selectTraffic,
        vatsimPilots,
        trafficLayerVisible,
        terrainEnable
    );
    const trafficLayer3D = useTrafficLayer3D(
        filteredTrafficData,
        terrainEnable && trafficLayerVisible
    );
    const trafficLayer2D = useTrafficLayer2D(
        filteredTrafficData,
        !terrainEnable && trafficLayerVisible
    );
    const localFlightLayer = useLocalTrackFlightLayer(flightData, movingMap, terrainEnable);
    // const trafficCallsignLayer = useTrafficCallsignLayer(filteredTrafficData, true);

    const layers = [
        trackLayer,
        trafficLayer2D,
        trafficLayer3D,
        // trafficCallsignLayer,
        controllerIconLayer,
        traconIconLayer,
        firIconLayer,
        localFlightLayer, //localFlightLayer will on top
    ];

    const handleHover = useCallback(
        throttle((info: PickingInfo) => {
            let match = false;
            if (
                info?.layer?.id === MERCATOR_TRACON_ICON_LAYER_ID ||
                info?.layer?.id === MERCATOR_FIR_ICON_LAYER_ID ||
                info?.layer?.id === MERCATOR_CONTROLLER_ICON_LAYER_ID ||
                info?.layer?.id === MERCATOR_TRAFFIC_LAYER_3D_ID ||
                info?.layer?.id === MERCATOR_TRAFFIC_LAYER_2D_ID
            ) {
                match = true;
            }

            if (
                (info?.layer?.id === MERCATOR_TRAFFIC_LAYER_2D_ID ||
                    info?.layer?.id === MERCATOR_TRAFFIC_LAYER_3D_ID) &&
                info?.object?.cid
            ) {
                setHoveredTraffic(info);
            } else {
                setHoveredTraffic(null);
            }

            setCursor(match ? "pointer" : "grab");
        }, 50),
        []
    );

    useEffect(() => {
        return () => {
            handleHover.cancel();
        };
    }, []);

    return (
        <>
            <DeckGlOverlay
                interleaved={true}
                onClick={(info: PickedTraffic) => deckOnClick(info)}
                layers={layers}
                pickingRadius={10}
                onHover={handleHover}
                onDragStart={() => setCursor("grabbing")}
                onDragEnd={() => setCursor("grab")}
                getCursor={() => cursor}
            />

            {hoveredTraffic && hoveredTraffic.object && !isTouchScreen && (
                <div
                    className="absolute z-10 pointer-events-none text-xs"
                    style={{
                        left: hoveredTraffic.x + 10,
                        top: hoveredTraffic.y + 10,
                    }}
                >
                    <HoveredTrafficTooltip info={hoveredTraffic.object} />
                </div>
            )}

            {hoveredController && <ControllerMarkerPopup hoverInfo={hoveredController} />}

            {hoveredTracon && <TraconLabelPopup hoverTracon={hoveredTracon} />}

            {hoveredFir && <FirLabelPopup hoverFir={hoveredFir} />}
        </>
    );
};

export default MainDeckGlLayer;

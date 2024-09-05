/**
 * Use to render the DeckGL overlay
 * */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WebMercatorViewport } from "@deck.gl/core/typed";
import DeckGlOverlay from "./deckGL_Layer/DeckGLOverlay";
import flightPathLayer from "./deckGL_Layer/flightPathLayer";
import trafficLayer_3D from "./deckGL_Layer/trafficLayer_3D";
import { AirportService, VatsimControllers, VatsimFlight } from "../../types";
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
import trafficLayer_2D from "./deckGL_Layer/trafficLayer_2D";
import renderLocalTrackFlightLayer from "./renderLocalTrackFlightLayer";
import useIsTouchScreen from "../../hooks/useIsTouchScreen";
import { useWebSocketContext } from "./WebSocketContext";
import filterTrafficDataInViewport from "./filterTrafficDataInViewport";
import { useMapRefContext } from "./MapRefContext";
import { useMap } from "react-map-gl";
import type { DeckGLRef } from "@deck.gl/react";
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


//TODO: clear the selected tracffic if comoponet first mountede, or navigated from other page


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

//TODO: Selected traffic state might be redundent
const MainDeckGlLayer = ({
    vatsimPilots,
    controllerData,
    controllerDataError,
    controllerDataLoading,
    trafficLayerVisible,
    movingMap,
}:
        MainTrafficLayerProps) => {

    const isTouchScreen = useIsTouchScreen();
    const dispatch = useDispatch();
    const { current: mapRef } = useMap();

    let isHovering = false;
    //TODO: debounce the state update
    const [selectTraffic, setSelectTraffic] = useState<VatsimFlight | null>(null);
    const {
        terrainEnable,
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    const { allAtcLayerVisible } = useSelector((state: RootState) => state.vatsimMapVisible);

    const { selectedTraffic: mapSearchSelectedTraffic } = useSelector((state: RootState) => state.mapSearchTraffic);
    const { searchResultsVisible } = useSelector((state: RootState) => state.mapDisplayPanel);

    // the previsouViewBounds will keep tracking a viewBounds that before user click the mouse to drag the map view
    const [currentViewBounds, setCurrentViewBounds] = useState<[number, number, number, number] | null>(null);
    // const [previousZoom, setPreviousZoom] = useState<number>(null);

    const [map, setMap] = useState<mapboxgl.Map>(null);


    const {
        matchedFirs,
        hoveredFir,
        isError: errorMatchedFirs
    } = useSelector((state: RootState) => state.matchedFirs);


    const {
        matchedFallbackTracons,
        matchedTracons,
        hoveredTracon,
        isLoading: isTraconLoading,
        isError: isTraconError
    } = useSelector((state: RootState) => state.matchedTracons);

    const { hoveredController } = useSelector((state: RootState) => state.matchedControllers);

    const getViewPort = (map: mapboxgl.Map) => {
        const viewport = new WebMercatorViewport({
            longitude: map.getCenter().lng,
            latitude: map.getCenter().lat,
            zoom: map.getZoom(),
            width: map.getCanvas().width,
            height: map.getCanvas().height,
        });
        const bounds = viewport.getBounds(); // [west, south, east, north]
        return bounds;
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
        isLoading: trackLoading
    } = useFetchTrafficTrackDataQuery(selectTraffic?.callsign ?? "", {
        skip: !selectTraffic
    });


    const filteredTrafficData = useMemo(() => {
        if (!currentViewBounds || !vatsimPilots || vatsimPilots.length === 0) return [];
        return filterTrafficDataInViewport(vatsimPilots, currentViewBounds);
    }, [currentViewBounds, vatsimPilots]);


    const { flightData } = useWebSocketContext();

    // const trafficLayer3D = useMemo(() => {
    //     if (terrainEnable && trafficLayerVisible) {
    //         return trafficLayer_3D(filteredTrafficData, true);
    //     }
    //     return null;
    // }, [terrainEnable, trafficLayerVisible, filteredTrafficData.length]);


    // const trafficLayer2D = useMemo(() => {
    //     return trafficLayer_2D(filteredTrafficData, !terrainEnable && trafficLayerVisible);
    // }, [terrainEnable, filteredTrafficData.length, trafficLayerVisible]);


    const localTrafficLayer = useMemo(() => {
        return renderLocalTrackFlightLayer(flightData, movingMap, terrainEnable);
    }, [movingMap, flightData, terrainEnable]);

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

    useEffect(() => {
        if (trackError) {
            dispatch(addMessage({
                location: "TRAFFIC_TRACK",
                messageType: "ERROR",
                content: "Error loading track data for selected traffic."
            }));
        }
        if (trackData) {
            dispatch(removeMessageByLocation({ location: "TRAFFIC_TRACK" }));
        }
    }, [trackData, trackError, trackLoading]);

    // const trackLayer = useMemo(() => {
    //     // this will clean up the path if user already pick a traffic on the map
    //     // but open the search list result panel. Because selectTraffic haven't change,
    //     // the path will reamin on the map.
    //     if (searchResultsVisible) {
    //         setSelectTraffic(null);
    //     }
    //
    //     if (trackData && !trackLoading && !trackError) {
    //         return flightPathLayer(trackData.data, selectTraffic, vatsimPilots, true, terrainEnable);
    //     }
    // }, [trackData, trackLoading, trackError, selectTraffic, terrainEnable, searchResultsVisible]);


    const deckOnClick = useCallback((info: PickedTraffic) => {
        console.log("onClick info:", info);
        if (info.layer &&
                (info.layer.id === "traffic-layer-2d" || info.layer.id === "traffic-layer-3d") &&
                info.object &&
                (!selectTraffic || (info.object.callsign !== selectTraffic.callsign))
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
    }, [selectTraffic]);

    const firIconLayer = useFirIconLayer(matchedFirs, allAtcLayerVisible);
    const traconIconLayer = useTraconIconLayer(matchedTracons, matchedFallbackTracons, allAtcLayerVisible);
    const controllerIconLayer = useControllerIconLayer(controllerData, allAtcLayerVisible);
    const trackLayer = useFlightPathLayer(trackData?.data, selectTraffic, vatsimPilots, trafficLayerVisible, terrainEnable);
    const trafficLayer3D = useTrafficLayer3D(filteredTrafficData, terrainEnable && trafficLayerVisible);
    const trafficLayer2D = useTrafficLayer2D(filteredTrafficData, !terrainEnable && trafficLayerVisible);

    const layers = [
        trackLayer,
        trafficLayer2D,
        trafficLayer3D,
        localTrafficLayer,
        controllerIconLayer,
        traconIconLayer,
        firIconLayer
    ];

    return (
        <>
            <DeckGlOverlay
                interleaved={true}
                onClick={(info: PickedTraffic) => deckOnClick(info)}
                layers={layers}
                pickingRadius={10}
                getTooltip={isTouchScreen ? undefined : ({ object }) => {
                    if (object) {
                        if (object?.iconUrl) return null;
                        const bgColor = "rgba(39, 40, 45, 0.9)";
                        return {
                            text: object && `${object.callsign}
                                      ${object?.flight_plan?.departure || "N/A"} - ${object?.flight_plan?.arrival
                                    || "N/A"}`,
                            style: {
                                fontStyle: "bold",
                                width: "auto",
                                height: "50px",
                                padding: "4px",
                                borderRadius: "10px",
                                textAlign: "center",
                                backgroundColor: bgColor,
                                color: "white",
                                marginLeft: "15px",
                                marginBottom: "5px",
                                zIndex: "100",
                            }
                        };
                    }
                }}
                onHover={({ object }) => (isHovering = Boolean(object))}
                getCursor={({ isDragging }) => (isDragging ? "auto" : (isHovering ? "pointer" : "grab"))}
            />

            {hoveredController &&
                <ControllerMarkerPopup hoverInfo={hoveredController}/>
            }

            {(hoveredTracon) &&
                <TraconLabelPopup hoverTracon={hoveredTracon}/>
            }

            {(hoveredFir) &&
                <FirLabelPopup hoverFir={hoveredFir}/>
            }

        </>
    );
};

export default MainDeckGlLayer;
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
    openTrafficDetail, useFetchVatsimControllersDataQuery
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
import { IconLayer } from "@deck.gl/layers/typed";
import generateControllerMarkerIcon from "./mapbox_Layer/util/generateControllerMarkerIcon";
import controllerIconLayer from "./deckGL_Layer/controllerIconLayer";
import ControllerIconLayer from "./deckGL_Layer/controllerIconLayer";
import generateFirIcon from "./mapbox_Layer/util/generateFirIcon";
import firIconLayer from "./deckGL_Layer/firIconLayer";
import traconIconLayer from "./deckGL_Layer/traconIconLayer";
import { MatchedFir } from "../../hooks/useMatchedFirs";
import { FallbackTracon, MatchedTracon } from "../../hooks/useMatchTracon";
import ControllerMarkerPopup from "./mapbox_Layer/Controller_Markers_Layer/ControllerMarkerPopup";
import { debounce } from "lodash";
import TraconLabelPopup, { HoverTracon } from "./mapbox_Layer/Tracon_Layers/TraconLabelPopup";
import FirLabelPopup from "./mapbox_Layer/FIR_Layers/FirLabelPopup";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import getAtcLayers from "./deckGL_Layer/getAtcLayers";


//TODO: clear the selected tracffic if comoponet first mountede, or navigated from other page

interface Viewport {
    longitude: number;
    latitude: number;
    zoom: number;
    width: number;
    height: number;
    pitch: number;
    bearing: number;
    isDragging: boolean;
}

//
// interface ChildProps {
//     viewState: Viewport;
// }

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
    let isHovering = false;
    //TODO: debounce the state update
    const [hoverControllerIcon, setHoverControllerIcon] = useState<AirportService | null>(null);
    const [hoverTraconIcon, setHoverTraconIcon] = useState<HoverTracon | null>(null);
    const [hoverFirIcon, setHoverFirIcon] = useState<MatchedFir | null>(null);
    const [selectTraffic, setSelectTraffic] = useState<VatsimFlight | null>(null);
    const {
        terrainEnable,
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    const { allAtcLayerVisible } = useSelector((state: RootState) => state.vatsimMapVisible);

    const { selectedTraffic: mapSearchSelectedTraffic } = useSelector((state: RootState) => state.mapSearchTraffic);
    const { searchResultsVisible } = useSelector((state: RootState) => state.mapDisplayPanel);

    // the previsouViewBounds will keep tracking a viewBounds that before user click the mouse to drag the map view
    const [previousViewBounds, setPreivousViewBounds] = useState<[number, number, number, number] | null>(null);
    const [previousZoom, setPreviousZoom] = useState<number>(null);
    const mapRef = useMapRefContext();
    const { current: map } = useMap();
    const deckRef = useRef<DeckGLRef | null>(null);


    const {
        matchedFirs,
        isError: errorMatchedFirs
    } = useSelector((state: RootState) => state.matchedFirs);


    const {
        matchedFallbackTracons,
        matchedTracons,
        isLoading: isTraconLoading,
        isError: isTraconError
    } = useSelector((state: RootState) => state.matchedTracons);


    /*
    * The currentViewBounds is the coordinates of viewport edge of current viewport
    * This will update if viewState changes
    * */
    // const currentViewBounds = useMemo(() => {
    //     const viewportBounds = new WebMercatorViewport({
    //         longitude: viewState.longitude,
    //         latitude: viewState.latitude,
    //         zoom: viewState.zoom,
    //         width: viewState.width,
    //         height: viewState.height
    //     }).getBounds();
    //     return viewportBounds;
    // }, [viewState]);
    // const currentViewBounds = useMemo(() => {
    //     if (!mapRef.current) return null;
    //     const map = mapRef.current.getMap();
    //     const bounds = map.getBounds();
    //     const viewBounds = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
    //     console.log("Bounds main traffic::", viewBounds);
    //
    //     return [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()] as [number, number, number, number];
    // }, [mapRef]);
    //
    //

    useEffect(() => {
        if (deckRef.current) {
            console.log("DECK REF:", deckRef);
        }
    }, [deckRef]);

    const currentViewBounds = useMemo(() => {
        if (!map) return [];
        const bounds = map.getBounds();
        const viewBounds = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
        console.log(viewBounds);
        return [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()] as [number, number, number, number];
    }, [map]);


    const {
        data: trackData,
        error: trackError,
        isLoading: trackLoading
    } = useFetchTrafficTrackDataQuery(selectTraffic?.callsign ?? "", {
        skip: !selectTraffic
    });


    const currentZoom = useMemo(() => {
        return mapRef.current?.getMap()
            .getZoom() ?? null;
    }, [mapRef]);

    const isDragging = mapRef.current?.isDragging ?? false;

    /*
    * Return filtered traffic data based on the map zoom state, view location
    * The filtered data length will trigger trafficLayer_2D or trafficLayer_3D function to run.
    * */
    const filteredTrafficData = useMemo(() => {
        if (!currentViewBounds || currentViewBounds.length === 0) return [];
        const data =
                        filterTrafficDataInViewport(
                            vatsimPilots,
                            currentViewBounds,
                            previousViewBounds,
                            currentZoom,
                            previousZoom,
                            isDragging
                        );
        // Update previousBounds after filtering
        if (!isDragging || (previousZoom && (previousZoom !== currentZoom))) {
            setPreviousZoom(currentZoom);
            setPreivousViewBounds(currentViewBounds);
        }

        return data;
    },
    [
        vatsimPilots,
        currentViewBounds,
        previousViewBounds,
        isDragging,
        currentZoom,
        previousZoom
    ]);


    const { flightData } = useWebSocketContext();

    const trafficLayer3D = useMemo(() => {
        if (terrainEnable && trafficLayerVisible) {
            return trafficLayer_3D(filteredTrafficData, true);
        }
        return null;
    }, [terrainEnable, trafficLayerVisible, filteredTrafficData.length]);


    const trafficLayer2D = useMemo(() => {
        return trafficLayer_2D(vatsimPilots, !terrainEnable && trafficLayerVisible);
    }, [terrainEnable, vatsimPilots.length, trafficLayerVisible]);


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

    const trackLayer = useMemo(() => {
        // this will clean up the path if user already pick a traffic on the map
        // but open the search list result panel. Because selectTraffic haven't change,
        // the path will reamin on the map.
        if (searchResultsVisible) {
            setSelectTraffic(null);
        }

        if (trackData && !trackLoading && !trackError) {
            return flightPathLayer(trackData.data, selectTraffic, vatsimPilots, true, terrainEnable);
        }
    }, [trackData, trackLoading, trackError, selectTraffic, terrainEnable, searchResultsVisible]);


    const deckOnClick = useCallback((info: PickedTraffic) => {
        if (info.layer && info.object && (!selectTraffic || (info.object.callsign !== selectTraffic.callsign))) {
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


    const atcLayer = useMemo(() => {
        if (controllerDataLoading || controllerDataError || isTraconLoading || isTraconError || errorMatchedFirs) {
            return [];
        }
        return getAtcLayers({
            atcLayerVisible: allAtcLayerVisible,
            matchedFirs,
            matchedFallbackTracons: matchedFallbackTracons,
            matchedTracons,
            controllerData,
            setHoverControllerIcon: setHoverControllerIcon,
            setHoverTraconIcon: setHoverTraconIcon,
            setHoverFirIcon: setHoverFirIcon
        });
    },
    [
        allAtcLayerVisible,
        matchedFirs,
        errorMatchedFirs,
        matchedFallbackTracons,
        matchedTracons,
        isTraconLoading,
        isTraconError,
        controllerData,
        controllerDataLoading,
        controllerDataError
    ]);


    const layers = useMemo(() => [
        trackLayer, // Always included
        terrainEnable ? trafficLayer3D : trafficLayer2D,
        localTrafficLayer,
        atcLayer
    ].filter(Boolean),
    [trackData,
        trafficLayer3D,
        trafficLayer2D,
        terrainEnable,
        selectTraffic,
        movingMap,
        flightData,
        trafficLayerVisible,
        allAtcLayerVisible,
        matchedFirs,
        controllerData,
        matchedTracons
    ]);

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

            {hoverControllerIcon &&
                <ControllerMarkerPopup hoverInfo={hoverControllerIcon}/>
            }

            {(hoverTraconIcon) &&
                <TraconLabelPopup hoverTracon={hoverTraconIcon}/>
            }

            {(hoverFirIcon) &&
                <FirLabelPopup hoverFir={hoverFirIcon}/>
            }
        </>
    );
};

export default MainDeckGlLayer;
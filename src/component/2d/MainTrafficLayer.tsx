/**
 * Use to render the DeckGL overlay
 * */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { WebMercatorViewport } from "@deck.gl/core/typed";
import DeckGlOverlay from "./deckGL_Layer/DeckGLOverlay";
import flightPathLayer from "./deckGL_Layer/flightPathLayer";
import trafficLayer_3D from "./deckGL_Layer/trafficLayer_3D";
import { VatsimFlight } from "../../types";
import { PickingInfo } from "@deck.gl/core/typed";
import {
    addMessage,
    removeMessageByLocation,
    useFetchTrafficTrackDataQuery,
    setSelectedTraffic,
    RootState,
    closeTrafficDetail,
    openTrafficDetail
} from "../../store";
import { useDispatch, useSelector } from "react-redux";
import trafficLayer_2D from "./deckGL_Layer/trafficLayer_2D";
import renderLocalTrackFlightLayer from "./renderLocalTrackFlightLayer";
import useIsTouchScreen from "../../hooks/useIsTouchScreen";
import { useWebSocketContext } from "./WebSocketContext";
import filterTrafficDataInViewport from "./filterTrafficDataInViewport";


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

interface ChildProps {
    viewState: Viewport;
}

interface MainTrafficLayerProps extends ChildProps {
    vatsimPilots: Array<VatsimFlight>;
    movingMap: boolean;
    trafficLayerVisible: boolean;
}

interface PickedTraffic extends PickingInfo {
    object?: VatsimFlight | null;
}

//TODO: Selected traffic state might be redundent
const MainTrafficLayer = ({
    vatsimPilots,
    trafficLayerVisible,
    movingMap,
    viewState
}:
        MainTrafficLayerProps) => {


    const dispatch = useDispatch();
    let isHovering = false;
    const [selectTraffic, setSelectTraffic] = useState<VatsimFlight | null>(null);
    const {
        terrainEnable,
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    const { selectedTraffic: mapSearchSelectedTraffic } = useSelector((state: RootState) => state.mapSearchTraffic);
    const { searchResultsVisible } = useSelector((state: RootState) => state.mapDisplayPanel);
    // the previsouViewBounds will keep tracking a viewBounds that before user click the mouse to drag the map view
    const [previousViewBounds, setPreivousViewBounds] = useState<[number, number, number, number] | null>(null);
    const [previousZoom, setPreviousZoom] = useState<number>(null);


    /*
    * The currentViewBounds is the coordinates of viewport edge of current viewport
    * This will update if viewState changes
    * */
    const currentViewBounds = useMemo(() => {
        const viewportBounds = new WebMercatorViewport({
            longitude: viewState.longitude,
            latitude: viewState.latitude,
            zoom: viewState.zoom,
            width: viewState.width,
            height: viewState.height
        }).getBounds();
        return viewportBounds;
    }, [viewState]);

    const {
        data: trackData,
        error: trackError,
        isLoading: trackLoading
    } = useFetchTrafficTrackDataQuery(selectTraffic?.callsign ?? "", {
        skip: !selectTraffic
    });

    /*
    * Return filtered traffic data based on the map zoom state, view location
    * The filtered data length will trigger trafficLayer_2D or trafficLayer_3D function to run.
    * */
    const filteredTrafficData = useMemo(() => {
        const data =
                        filterTrafficDataInViewport(
                            vatsimPilots,
                            currentViewBounds,
                            previousViewBounds,
                            viewState.zoom,
                            previousZoom,
                            viewState.isDragging
                        );
        // Update previousBounds after filtering
        if (!viewState.isDragging || (previousZoom && (previousZoom !== viewState.zoom))) {
            setPreviousZoom(viewState.zoom);
            setPreivousViewBounds(currentViewBounds);
        }

        return data;
    },
    [
        vatsimPilots,
        currentViewBounds,
        previousViewBounds,
        viewState.isDragging,
        viewState.zoom,
        previousZoom
    ]);


    const { flightData } = useWebSocketContext();

    // const matchedFirIds = useMatchedFirIds(controllerData);

    const trafficLayer3D = useMemo(() => {
        if (terrainEnable && trafficLayerVisible) {
            return trafficLayer_3D(filteredTrafficData, true);
        }
        return null;
    }, [terrainEnable, trafficLayerVisible, filteredTrafficData.length]);


    const trafficLayer2D = useMemo(() => {
        return trafficLayer_2D(filteredTrafficData, !terrainEnable && trafficLayerVisible);
    }, [terrainEnable, filteredTrafficData.length, trafficLayerVisible]);

    // const activeFir = useMemo(() => {
    //     return selectedFirLayer(matchedFirIds);
    // }, [controllerData]);

    const localTrafficLayer = useMemo(() => {
        return renderLocalTrackFlightLayer(flightData, movingMap, terrainEnable);
    }, [movingMap, flightData, terrainEnable]);

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

    const layers = useMemo(() => [
        // activeFir,
        trackLayer, // Always included
        terrainEnable ? trafficLayer3D : trafficLayer2D,
        localTrafficLayer
    ].filter(Boolean),
    [trackData, trafficLayer3D, trafficLayer2D, terrainEnable,
        selectTraffic, movingMap, flightData, trafficLayerVisible]);

    const isTouchScreen = useIsTouchScreen();
    return (
        <DeckGlOverlay
            interleaved={true}
            onClick={(info: PickedTraffic) => deckOnClick(info)}
            layers={layers}
            pickingRadius={10}
            getTooltip={isTouchScreen ? undefined : ({ object }) => {
                if (object) {
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
    );
};

export default React.memo(MainTrafficLayer);
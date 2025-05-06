import React, { useEffect } from "react";
import BaseMap from "./BaseMap";
import AtcLayer from "./AtcLayer";
import BaseDeckGlLayer from "../BaseDeckGlLayer";
import NexradLayer from "./Nexrad_Layer/NxradLayer";
import MapErrorMessageStack from "../map_error_loading/MapErrorMessageStack";
import FlightInfo from "../detail_flight_info_panel/FlightInfo";
import { useDispatch, useSelector } from "react-redux";
import {
    RootState,
    setFallbackGeoJson,
    setMatchedFallbackTracons,
    setMatchedFirs,
    setMatchedFirsError,
    setMatchedTraconError,
    setMatchedTraconLoading,
    setMatchedTracons,
    toggleFeaturedAirports,
    toggleMapFilterButton,
    toggleMapStyleButton,
    toggleSearchBox,
    useFetchVatsimControllersDataQuery,
} from "../../../store";
import { VatsimFlight } from "../../../types";
import DayNightLayer from "./DayNightTerminator_Layers/DayNightLayer";
import AirportDepartureArrivalDisplay
    from "../map_feature_toggle_button/search_box/search_results_display_panel/AirportDepartureArrivalDisplay";
import AircraftDisplay from "../map_feature_toggle_button/search_box/search_results_display_panel/AircraftDisplay";
import useMatchTracon from "../../../hooks/useMatchTracon";
import useMatchedFirs from "../../../hooks/useMatchedFirs";
import { Helmet } from "react-helmet-async";
import { useMap } from "react-map-gl";
import { useGlobeLayerOrdering } from "../../../hooks/useGlobeLayerOrdering";
import GlobeMapLayerManager from "../GlobeMapLayerManager";
import MapEffectManager from "../MapEffectManager";

const MainMap = () => {
    const map = useMap();
    const dispatch = useDispatch();

    const traffic = useSelector<RootState, VatsimFlight>((state) => state.vatsimMapTraffic.selectedTraffic || null);

    const { selectedAirport } = useSelector((state: RootState) => state.mapSearchAirport);

    const {
        dayNightTerminator,
        mapProjection
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const {
        activePanel,
        searchResultsType,
        searchResultsVisible,
        trafficDetailVisible
    } = useSelector(
        (state: RootState) => state.mapDisplayPanel,
    );

    if (!window.WebGLRenderingContext) {
        return <div>Unsupported Device</div>;
    }

    const renderAircraftDisplayPanel = () => {
        if (activePanel === "searchResults" && searchResultsType === "AIRCRAFT" && searchResultsVisible) {
            return <AircraftDisplay/>;
        }
        return null;
    };

    const renderAircraftDepartureArrivalDisplayPanel = () => {
        if (activePanel === "searchResults" && searchResultsType === "AIRPORT" && searchResultsVisible) {
            return <AirportDepartureArrivalDisplay airport={selectedAirport}/>;
        }
        return null;
    };

    const renderFlightInfoPanel = () => {
        if (activePanel === "trafficDetail" && trafficDetailVisible && traffic && traffic.callsign.length !== 0) {
            return <FlightInfo/>;
        }
        return null;
    };

    const {
        data: controllerData,
        error: controllerError,
        isLoading: controllerLoading,
    } = useFetchVatsimControllersDataQuery(undefined, { pollingInterval: 60000 });

    const {
        matchedFirs,
        isError: isFirError
    } = useMatchedFirs(controllerData);

    // close all panel upon first time loading.
    useEffect(() => {
        dispatch(toggleFeaturedAirports(false));
        dispatch(toggleSearchBox(false));
        dispatch(toggleMapFilterButton(false));
        dispatch(toggleMapStyleButton(false));
    }, []);

    //change globe projection layer order
    useEffect(() => {
        console.log("map:", map);
        if (map.current) {
            console.log("Current map:", map.current);
            useGlobeLayerOrdering(map.current?.getMap());
        }
    }, [map]);

    const {
        matchedTracons,
        fallbackGeoJson, //fallback GeoJSON data
        matchedFallbackTracons, // fallback controller info
        isLoading: isTraconLoading,
        isError: isTraconError,
    } = useMatchTracon(controllerData);

    useEffect(() => {
        if (controllerLoading) {
            dispatch(setMatchedTraconLoading(true));
        } else if (controllerError) {
            dispatch(setMatchedTraconError(true));
        } else {
            dispatch(setMatchedTraconLoading(false));
            dispatch(setMatchedTraconError(false));
        }
    }, [controllerLoading, controllerError, dispatch, controllerData]);

    useEffect(() => {
        if (matchedFirs.length !== 0) {
            dispatch(setMatchedFirs(matchedFirs));
        } else if (isFirError) {
            dispatch(setMatchedFirsError(isFirError)); // This will clear Fir array
        }
    }, [matchedFirs, isFirError, dispatch, controllerData, controllerError, controllerLoading]);

    useEffect(() => {
        if (matchedTracons) {
            dispatch(setMatchedTracons(matchedTracons));
        }
        if (matchedFallbackTracons) {
            dispatch(setMatchedFallbackTracons(matchedFallbackTracons));
        }
        if (fallbackGeoJson) {
            dispatch(setFallbackGeoJson(fallbackGeoJson));
        }
        if (isTraconLoading) {
            dispatch(setMatchedTraconLoading(true));
        } else {
            dispatch(setMatchedTraconLoading(false));
        }
        if (isTraconError) {
            dispatch(setMatchedTraconError(isTraconError));
        }
    }, [
        matchedTracons,
        matchedFallbackTracons,
        fallbackGeoJson,
        isTraconLoading,
        isTraconError,
        dispatch,
        controllerData,
        controllerError,
        controllerLoading,
    ]);

    useEffect(() => {
        // Check if running in Chrome
        const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);

        if (isChrome) {
            // Check for hardware acceleration
            const canvas = document.createElement("canvas");
            const gl =
                    canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

            if (gl) {
                const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
                const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "";

                // If software rendering is being used, show a warning
                if (
                    renderer.toLowerCase()
                        .includes("swiftshader") ||
                        renderer.toLowerCase()
                            .includes("software") ||
                        !renderer
                ) {
                    console.warn(
                        "Hardware acceleration is disabled in Chrome. " +
                            "This may cause high CPU usage. " +
                            "Enable hardware acceleration in Chrome settings for better performance.",
                    );
                }
            }
        }
    }, []);

    return (
        <>
            <Helmet>
                <title>VATSIM Map</title>
                <meta
                    name="description"
                    content="Explore live VATSIM traffic with our interactive map. Track flights, view controllers, and stay updated on real-time air traffic."
                />
                <meta
                    name="keyword"
                    content="VATSIM map, live air traffic, VATSIM controllers, VATSIM flights, live flight tracking"
                />
                <link rel="canonical" href="https://airportweather.org/map"/>
            </Helmet>
            <div>
                <BaseMap>
                    <MapErrorMessageStack/>
                    <MapEffectManager/>
                    <GlobeMapLayerManager
                        matchedFirs={matchedFirs}
                        errorMatchedFirs={isFirError}
                        matchedTracons={matchedTracons}
                        matchedFallbackTracons={matchedFallbackTracons}
                        isTraconLoading={isTraconLoading}
                        isTraconError={isTraconError}
                        controllerData={controllerData}
                    />
                    <AtcLayer
                        controllerData={controllerData}
                        controllerLoading={controllerLoading}
                        controllerError={controllerError}
                    />
                    {/*Only load DeckGl Layer if map projection is mercator*/}
                    {mapProjection === "mercator" && (
                        <BaseDeckGlLayer
                            controllerData={controllerData}
                            controllerDataLoading={controllerLoading}
                            controllerDataError={controllerError}
                        />
                    )}
                    <NexradLayer/>
                    {dayNightTerminator && <DayNightLayer/>}
                    {renderFlightInfoPanel()}
                    {renderAircraftDepartureArrivalDisplayPanel()}
                    {renderAircraftDisplayPanel()}
                </BaseMap>
            </div>
        </>
    );
};

export default MainMap;

import React, { useEffect } from "react";
import BaseMap from "./BaseMap";
import AtcLayer from "./AtcLayer";
import BaseDeckGlLayer from "../BaseDeckGlLayer";
import NexradLayer from "./Nexrad_Layer/NxradLayer";
import MapErrorMessageStack from "../map_error_loading/MapErrorMessageStack";
import FlightInfo from "../detail_flight_info_panel/FlightInfo";
import { useDispatch, useSelector } from "react-redux";
import {
    RootState, setFallbackGeoJson,
    setMatchedFallbackTracons,
    setMatchedFirs, setMatchedFirsError, setMatchedTraconError, setMatchedTraconLoading,
    setMatchedTracons,
    useFetchVatsimControllersDataQuery
} from "../../../store";
import { VatsimFlight } from "../../../types";
import DayNightLayer from "./DayNightTerminator_Layers/DayNightLayer";
import AirportDepartureArrivalDisplay
    from "../map_feature_toggle_button/search_box/search_results_display_panel/AirportDepartureArrivalDisplay";
import AircraftDisplay from "../map_feature_toggle_button/search_box/search_results_display_panel/AircraftDisplay";
import useMatchTracon from "../../../hooks/useMatchTracon";
import useMatchedFirs from "../../../hooks/useMatchedFirs";

const MainMap = () => {
    const dispatch = useDispatch();

    const traffic = useSelector<RootState, VatsimFlight>(
        state => state.vatsimMapTraffic.selectedTraffic || null);

    const {
        selectedAirport,
    } = useSelector((state: RootState) => state.mapSearchAirport);

    const {
        dayNightTerminator,
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const {
        activePanel,
        searchResultsType,
        searchResultsVisible,
        trafficDetailVisible
    } = useSelector((state: RootState) => state.mapDisplayPanel);


    if (!window.WebGLRenderingContext) {
        return (
            <div>
                Unsupported Device
            </div>
        );
    }

    const renderAircraftDisplayPanel = () => {
        if (activePanel === "searchResults" &&
                searchResultsType === "AIRCRAFT" &&
                searchResultsVisible
        ) {
            return <AircraftDisplay/>;
        }
        return null;
    };

    const renderAircraftDepartureArrivalDisplayPanel = () => {
        if (activePanel === "searchResults" &&
                searchResultsType === "AIRPORT" &&
                searchResultsVisible) {
            return <AirportDepartureArrivalDisplay
                airport={selectedAirport}
            />;
        }
        return null;
    };

    const renderFlightInfoPanel = () => {
        if (activePanel === "trafficDetail" &&
                trafficDetailVisible &&
                traffic &&
                traffic.callsign.length !== 0) {
            return <FlightInfo/>;
        }
        return null;
    };

    const {
        data: controllerData,
        error: controllerError,
        isLoading: controllerLoading
    } = useFetchVatsimControllersDataQuery(undefined, { pollingInterval: 60000 });


    const {
        matchedFirs,
        isError: isFirError
    } = useMatchedFirs(controllerData);

    const {
        matchedTracons,
        fallbackGeoJson, //fallback GeoJSON data
        matchedFallbackTracons, // fallback controller info
        isLoading: isTraconLoading,
        isError: isTraconError
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
    }, [matchedTracons, matchedFallbackTracons, fallbackGeoJson, isTraconLoading, isTraconError, dispatch, controllerData, controllerError, controllerLoading]);


    return (
        <div>
            <BaseMap>
                <MapErrorMessageStack/>
                <AtcLayer
                    controllerData={controllerData}
                    controllerLoading={controllerLoading}
                    controllerError={controllerError}
                />
                <BaseDeckGlLayer
                    controllerData={controllerData}
                    controllerDataLoading={controllerLoading}
                    controllerDataError={controllerError}
                />
                <NexradLayer/>
                {dayNightTerminator && <DayNightLayer/>}
                {renderFlightInfoPanel()}
                {renderAircraftDepartureArrivalDisplayPanel()}
                {renderAircraftDisplayPanel()}
            </BaseMap>
        </div>
    );
};

export default MainMap;
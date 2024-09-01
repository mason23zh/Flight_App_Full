import React from "react";
import BaseMap from "./BaseMap";
import AtcLayer from "./AtcLayer";
import BaseDeckGlLayer from "../BaseDeckGlLayer";
import NexradLayer from "./Nexrad_Layer/NxradLayer";
import MapErrorMessageStack from "../map_error_loading/MapErrorMessageStack";
import FlightInfo from "../detail_flight_info_panel/FlightInfo";
import { useSelector } from "react-redux";
import { RootState, useFetchVatsimControllersDataQuery } from "../../../store";
import { VatsimFlight } from "../../../types";
import DayNightLayer from "./DayNightTerminator_Layers/DayNightLayer";
import { useInitializeDatabase } from "../../../hooks/useInitializeDatabase";
import AirportDepartureArrivalDisplay
    from "../map_feature_toggle_button/search_box/search_results_display_panel/AirportDepartureArrivalDisplay";
import { CustomProvider } from "rsuite";
import AircraftDisplay from "../map_feature_toggle_button/search_box/search_results_display_panel/AircraftDisplay";
import generateControllerMarkerIcon from "./util/generateControllerMarkerIcon";
import useMatchTracon from "../../../hooks/useMatchTracon";
import useMatchedFirs from "../../../hooks/useMatchedFirs";

//TODO: High memory usage
const MainMap = () => {
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


    useInitializeDatabase();

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

    if (controllerLoading || controllerError) {
        return <div>Loading...</div>;
    }

    console.log("matchedFirs", matchedFirs);
    console.log("matched tracons:", matchedTracons);

    return (
        <CustomProvider theme="light">
            <div>
                <BaseMap>
                    <MapErrorMessageStack/>
                    <AtcLayer
                        controllerData={controllerData}
                        controllerLoading={controllerLoading}
                        controllerError={controllerError}
                    />
                    <BaseDeckGlLayer
                        matchedFirs={matchedFirs}
                        matchedTracons={matchedTracons}
                        matchedFallbackTracons={matchedFallbackTracons}
                        matchedFirError={isFirError}
                        matchedTraconError={isTraconError}
                    />
                    <NexradLayer/>
                    {dayNightTerminator && <DayNightLayer/>}
                    {renderFlightInfoPanel()}
                    {renderAircraftDepartureArrivalDisplayPanel()}
                    {renderAircraftDisplayPanel()}
                </BaseMap>
            </div>
        </CustomProvider>
    );
};

export default MainMap;
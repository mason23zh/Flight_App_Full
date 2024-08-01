import React from "react";
import BaseMap from "./BaseMap";
import AtcLayer from "./AtcLayer";
import BaseTrafficLayer from "../BaseTrafficLayer";
import NexradLayer from "./Nexrad_Layer/NxradLayer";
import MapErrorMessageStack from "../map_error_loading/MapErrorMessageStack";
import FlightInfo from "../detail_flight_info_panel/FlightInfo";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { VatsimFlight } from "../../../types";
import DayNightLayer from "./DayNightTerminator_Layers/DayNightLayer";
import { useInitializeDatabase } from "../../../hooks/useInitializeDatabase";
import AirportDepartureArrivalDisplay
    from "../map_feature_toggle_button/search_box/search_results_display_panel/AirportDepartureArrivalDisplay";
import { CustomProvider } from "rsuite";
import AircraftDisplay from "../map_feature_toggle_button/search_box/search_results_display_panel/AircraftDisplay";


const MainMap = () => {
    const traffic = useSelector<RootState, VatsimFlight>(
        state => state.vatsimMapTraffic.selectedTraffic || null);

    const {
        selectedAirport,
        airportDepartureArrivalDisplay
    } = useSelector((state: RootState) => state.mapSearchAirport);

    //TODO: don't need this to control panel display
    const {
        selectedAircraftType,
        aircraftListDisplay
    }
            = useSelector((state: RootState) => state.mapSearchAircraft);

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
        console.log("Active panel:", activePanel);
        console.log("search results type:", searchResultsType);
        console.log("search results visible:", searchResultsVisible);
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

    return (
        <CustomProvider theme="light">
            <div>
                <BaseMap>
                    <MapErrorMessageStack/>
                    <AtcLayer/>
                    <BaseTrafficLayer/>
                    <NexradLayer/>
                    {dayNightTerminator && <DayNightLayer/>}
                    {/* {(!aircraftListDisplay && */}
                    {/*                     !airportDepartureArrivalDisplay && */}
                    {/*                     traffic && */}
                    {/*                     traffic.callsign.length !== 0) && */}
                    {/*                     <FlightInfo/> */}
                    {/* } */}
                    {
                        renderFlightInfoPanel()
                    }
                    {
                        renderAircraftDepartureArrivalDisplayPanel()
                    }
                    {
                        renderAircraftDisplayPanel()
                    }
                </BaseMap>
            </div>
        </CustomProvider>
    );
};

export default MainMap;
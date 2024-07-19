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


const MainMap = () => {
    const traffic = useSelector<RootState, VatsimFlight>(
        state => state.vatsimMapTraffic.selectedTraffic || null);

    const {
        selectedAirport,
        airportDepartureArrivalDisplay
    } = useSelector((state: RootState) => state.mapSearchAirport);


    const {
        dayNightTerminator,
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    useInitializeDatabase();


    if (!window.WebGLRenderingContext) {
        return (
            <div>
                Unsupported Device
            </div>
        );
    }

    return (
        <div>
            <BaseMap>
                <MapErrorMessageStack/>
                <AtcLayer/>
                <BaseTrafficLayer/>
                <NexradLayer/>
                {dayNightTerminator && <DayNightLayer/>}
                {(!airportDepartureArrivalDisplay &&
                                    traffic &&
                                    traffic.callsign.length !== 0) &&
                                    <FlightInfo/>}
                {(selectedAirport && airportDepartureArrivalDisplay) &&
                    <AirportDepartureArrivalDisplay
                        airport={selectedAirport}
                    />
                }
            </BaseMap>
        </div>
    );
};

export default MainMap;
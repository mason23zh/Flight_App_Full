import React from "react";
import OverallDataBlock from "./OverallDataBlock";
import LiveDataBlock from "./LiveDataBlock";
import OtherDataBlock from "./OtherDataBlock";
import { useSelector } from "react-redux";
import { RootState, useFetchBasicAirportWithICAOQuery } from "../../../store";
import { VatsimFlight } from "../../../types";
import distanceInKmBetweenEarthCoordinates from "../../../util/coordinatesDistanceCalculator";
import OverallDataBlock2 from "./OverallDataBlock2";

//!TODO: Performance, error handling

const FlightInfo = () => {
    const traffic = useSelector<RootState, VatsimFlight>(
        state => state.vatsimMapTraffic.selectedTraffic || null);
    console.log("Selected traffic:", traffic);


    const {
        data: departureAirport,
        error: errorDepartureAirport,
        isLoading: loadingDepartureAirport
    } = useFetchBasicAirportWithICAOQuery(traffic.flight_plan?.departure);

    const {
        data: arrivalAirport,
        error: errorArrivalAirport,
        isLoading: loadingArrivalAirport
    } = useFetchBasicAirportWithICAOQuery(traffic.flight_plan?.arrival);

    console.log("departureAirport:", departureAirport);


    if (!traffic || traffic.callsign.length === 0) {
        return <></>;
    }


    if (errorArrivalAirport || errorDepartureAirport) {
        return <div>Error</div>;
    }

    if (loadingArrivalAirport || loadingDepartureAirport) {
        return <div>Loading...</div>;
    }

    if (departureAirport && arrivalAirport
            && departureAirport.data.length !== 0 && arrivalAirport.data.length !== 0) {
        let toGoDistance = -1;
        let progress = -1;
        let depAirport = "";
        let arrAirport = "";
        if (departureAirport.data[0] && arrivalAirport.data[0]) {
            const depAirportCoord = departureAirport.data[0]?.station.geometry.coordinates;
            const arrAirportCoord = arrivalAirport.data[0]?.station.geometry.coordinates;
            const totalDistance = Math.round(distanceInKmBetweenEarthCoordinates(
                depAirportCoord[1],
                depAirportCoord[0],
                arrAirportCoord[1],
                arrAirportCoord[0]
            ) * 0.539957);
            toGoDistance =
                    Math.round(
                        distanceInKmBetweenEarthCoordinates(
                            traffic.latitude, traffic.longitude, arrAirportCoord[1], arrAirportCoord[0]
                        ) * 0.539957);

            progress = Math.round((1 - toGoDistance / totalDistance) * 100);
            depAirport = traffic.flight_plan?.departure || "N/A";
            arrAirport = traffic.flight_plan?.arrival || "N/A";
        }

        return (
            <div className="z-[200] absolute max-w-[300px] min-w-[300px]">
                <div className="grid-cols-1">
                    <OverallDataBlock2
                        aircraft={traffic.flight_plan?.aircraft_faa}
                        callsign={traffic.callsign}
                        depAirport={departureAirport}
                        arrAirport={arrivalAirport}
                        etd={traffic.flight_plan?.deptime}
                        enroute={traffic.flight_plan?.enroute_time}
                        progress={progress}
                    />
                    {/* <OverallDataBlock */}
                    {/*     callsign={traffic.callsign} */}
                    {/*     progress={progress} */}
                    {/*     departure={depAirport} */}
                    {/*     arrival={arrAirport} */}
                    {/* /> */}

                    <LiveDataBlock
                        altitude={traffic.altitude}
                        groundspeed={traffic.groundspeed}
                        toGoDistance={toGoDistance}
                    />

                    <OtherDataBlock/>
                </div>
            </div>
        );
    }
};

export default FlightInfo;
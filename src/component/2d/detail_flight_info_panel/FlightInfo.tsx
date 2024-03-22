import React from "react";
import OverallDataBlock from "./OverallDataBlock";
import LiveDataBlock from "./LiveDataBlock";
import OtherDataBlock from "./OtherDataBlock";
import FlightProgressBar from "./FlightProgressBar";
import { useSelector } from "react-redux";
import { RootState, useFetchBasicAirportWithICAOQuery } from "../../../store";
import { VatsimFlight } from "../../../types";
import overallDataBlock from "./OverallDataBlock";
import liveDataBlock from "./LiveDataBlock";
import distanceInKmBetweenEarthCoordinates from "../../../util/coordinatesDistanceCalculator";

const FlightInfo = () => {
    let renderOverallBlock;
    let renderLiveDataBlock;
    const traffic = useSelector<RootState, VatsimFlight>(
        state => state.vatsimMapTraffic.selectedTraffic || null);
    console.log("Selected traffic:", traffic);

    if (!traffic || traffic.callsign.length === 0) {
        return <></>;
    }

    const {
        data: departureAirport,
        error: errorDepartureAirport,
        isLoading: loadingDepartureAirport
    } = useFetchBasicAirportWithICAOQuery(traffic.flight_plan.departure);

    const {
        data: arrivalAirport,
        error: errorArrivalAirport,
        isLoading: loadingArrivalAirport
    } = useFetchBasicAirportWithICAOQuery(traffic.flight_plan.arrival);

    if (errorArrivalAirport || errorDepartureAirport) {
        return <div>Error</div>;
    }

    if (loadingArrivalAirport || loadingDepartureAirport) {
        return <div>Loading...</div>;
    }

    if (departureAirport && arrivalAirport) {
        const depAirportCoord = departureAirport.data[0]?.station.geometry.coordinates;
        const arrAirportCoord = arrivalAirport.data[0]?.station.geometry.coordinates;
        const totalDistance = Math.round(distanceInKmBetweenEarthCoordinates(
            depAirportCoord[1],
            depAirportCoord[0],
            arrAirportCoord[1],
            arrAirportCoord[0]
        ) * 0.539957);
        const toGoDistance =
                Math.round(
                    distanceInKmBetweenEarthCoordinates(
                        traffic.latitude, traffic.longitude, arrAirportCoord[1], arrAirportCoord[0]
                    ) * 0.539957);

        const progress = Math.round((1 - toGoDistance / totalDistance) * 100);
        console.log("progress:", progress);


        return (
            <div className="z-[200] absolute max-w-[300px] min-w-[300px]">
                <div className="grid-cols-1">
                    <OverallDataBlock
                        callsign={traffic.callsign}
                        progress={progress}
                    />

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
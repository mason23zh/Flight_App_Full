import React from "react";
import LiveDataBlock from "./LiveDataBlock";
import OverallDataBlock from "./OverallDataBlock";
import OtherDataBlock from "./OtherDataBlock";
import { useSelector } from "react-redux";
import { RootState, useFetchBasicAirportWithICAOQuery } from "../../../store";
import { VatsimFlight } from "../../../types";
import { CustomProvider } from "rsuite";
import distanceInKmBetweenEarthCoordinates from "../../../util/coordinatesDistanceCalculator";

const FlightInfo = () => {
    const traffic = useSelector<RootState, VatsimFlight>(
        state => state.vatsimMapTraffic.selectedTraffic || null);

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
        // const depAirport = "";
        // const arrAirport = "";
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

            progress = Math.round((1 - (toGoDistance / totalDistance)) * 100);
        }

        return (
            <CustomProvider theme={"light"}>
                <div
                    className="z-[200] absolute right-0 top-0
                translate-x-[-15%] translate-y-[5%] max-w-[350px] min-w-[350px]"
                >
                    <div className="grid-cols-1 bg-gray-500/30 backdrop-blur-lg">
                        <div className="bg-gray-500">
                            <OverallDataBlock
                                aircraft={traffic.flight_plan?.aircraft_faa}
                                callsign={traffic.callsign}
                                depAirport={departureAirport}
                                arrAirport={arrivalAirport}
                                etd={traffic.flight_plan?.deptime}
                                enroute={traffic.flight_plan?.enroute_time}
                                progress={progress}
                            />

                            <LiveDataBlock
                                altitude={traffic.altitude}
                                groundspeed={traffic.groundspeed}
                                toGoDistance={toGoDistance}
                            />
                        </div>

                        <OtherDataBlock
                            flight_plan={traffic.flight_plan}
                            depAirport={departureAirport}
                            arrAirport={arrivalAirport}
                        />
                    </div>
                </div>
            </CustomProvider>
        );
    }
};

export default FlightInfo;
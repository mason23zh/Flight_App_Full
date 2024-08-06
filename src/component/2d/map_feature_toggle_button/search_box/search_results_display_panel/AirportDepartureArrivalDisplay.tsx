import React, { useEffect, useState } from "react";
import { LocalDbAirport, VatsimFlight } from "../../../../../types";
import { Tabs } from "rsuite";
import { searchFlightsByAirports } from "../mapSearchFunction";
import TrafficDetailList from "./TrafficDetailList";
import AirportInfoSection from "./AirportInfoSection";
import AirportDepartureArrivalPanelInfoTab from "./AirportDepartureArrivalPanelInfoTab";

interface Props {
    airport: LocalDbAirport;
    // flights: VatsimFlight[];
}

const AirportDepartureArrivalDisplay = ({
    airport
}: Props) => {
    const [arrivalTraffic, setArrivalTraffic] = useState<VatsimFlight[]>(null);
    const [departureTraffic, setDepartureTraffic] = useState<VatsimFlight[]>(null);
    const style = "text-white max-h-[400px] sm:min-h-[600px] bg-gray-500 z-[200] absolute left-1/2 top-0 translate-x-[-50%] " +
            "translate-y-[5%] max-w-[290px] min-w-[290px] sm:right-5 " +
            "sm:left-auto sm:translate-x-[0] sm:translate-y-[5%] sm:max-w-[350px] sm:min-w-[350px] " +
            "top-[1vh] sm:top-auto";

    useEffect(() => {
        (async () => {
            const arrivalTraffic = [];
            const departureTraffic = [];
            const results = await searchFlightsByAirports(airport.ident || "");
            results.filter((traffic) => {
                if (traffic?.flight_plan?.departure.toLowerCase() === airport.ident.toLowerCase()) {
                    departureTraffic.push(traffic);
                } else if (traffic?.flight_plan?.arrival.toLowerCase() === airport.ident.toLowerCase()) {
                    arrivalTraffic.push(traffic);
                }
            });

            setArrivalTraffic(arrivalTraffic);
            setDepartureTraffic(departureTraffic);
        })();
    }, [airport]);

    return (
        <div className={style}>
            <div className="mb-2">
                <AirportInfoSection airport={airport}/>
            </div>
            <Tabs defaultActiveKey="1">
                <Tabs.Tab eventKey="1" title={`Departure (${departureTraffic?.length || 0})`}>
                    <TrafficDetailList
                        flights={departureTraffic}
                        arrival={false}
                    />
                </Tabs.Tab>
                <Tabs.Tab eventKey="2" title={`Arrival (${arrivalTraffic?.length || 0})`}>
                    <TrafficDetailList
                        flights={arrivalTraffic}
                        arrival={true}
                    />
                </Tabs.Tab>
                <Tabs.Tab eventKey="3" title="Information">
                    <AirportDepartureArrivalPanelInfoTab airport={airport}/>
                </Tabs.Tab>
            </Tabs>
        </div>
    );
};

export default AirportDepartureArrivalDisplay;
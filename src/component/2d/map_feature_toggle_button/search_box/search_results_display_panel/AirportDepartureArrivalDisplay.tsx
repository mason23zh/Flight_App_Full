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

    const style =
            "text-white h-[60vh] sm:h-[70vh] bg-gray-500 z-[200] absolute left-1/2 top-0 transform -translate-x-1/2 " +
            "sm:right-5 sm:left-auto sm:translate-x-0 sm:translate-y-[5%] w-[300px] sm:max-w-[350px] sm:min-w-[350px] " +
            "top-[1vh] sm:top-auto rounded-lg overflow-hidden flex flex-col";

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
            <div className="mb-2 p-1 bg-gray-500">
                <AirportInfoSection airport={airport}/>
            </div>
            <div className="flex-1 overflow-auto">
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
                        <div className="">
                            <AirportDepartureArrivalPanelInfoTab airport={airport}/>
                        </div>
                    </Tabs.Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default AirportDepartureArrivalDisplay;
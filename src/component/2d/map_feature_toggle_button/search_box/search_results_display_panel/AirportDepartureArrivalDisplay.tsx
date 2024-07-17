import React from "react";
import { VatsimFlight } from "../../../../../types";
import { Tabs } from "rsuite";
import SearchBoxAirportDisplaySection from "../SearchBoxAirportDisplaySection";

interface Props {
    flights: VatsimFlight[];
}

const AirportDepartureArrivalDisplay = ({ flights }: Props) => {
    return (
        <div className="p-2">
            <Tabs defaultActiveKey="1">
                <Tabs.Tab eventKey="1" title="Departure">
                    <div>
                        Departure Flights
                    </div>
                </Tabs.Tab>
                <Tabs.Tab eventKey="2" title="Arrival">
                    <div>
                        Arrival Flights
                    </div>
                </Tabs.Tab>
            </Tabs>
            <div>
                DETAILED CONTENT
            </div>
        </div>
    );
};

export default AirportDepartureArrivalDisplay;
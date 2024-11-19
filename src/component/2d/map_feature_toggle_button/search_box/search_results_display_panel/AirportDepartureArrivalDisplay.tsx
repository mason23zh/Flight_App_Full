import React, { useEffect, useState } from "react";
import { LocalDbAirport, VatsimFlight } from "../../../../../types";
import { searchFlightsByAirports } from "../mapSearchFunction";
import TrafficDetailList from "./TrafficDetailList";
import AirportInfoSection from "./AirportInfoSection";
import AirportDepartureArrivalPanelInfoTab from "./AirportDepartureArrivalPanelInfoTab";
import AirportDepartureArrivalDisplay_TabButtonGroup from "./AirportDepartureArrivalDisplay_TabButtonGroup";

interface Props {
    airport: LocalDbAirport;
}

const AirportDepartureArrivalDisplay = ({
    airport
}: Props) => {
    const [arrivalTraffic, setArrivalTraffic] = useState<VatsimFlight[]>(null);
    const [departureTraffic, setDepartureTraffic] = useState<VatsimFlight[]>(null);
    const [activeTab, setActiveTab] = useState<"departure" | "arrival" | "info">("departure");
    const [loading, setLoading] = useState(true);

    const wrapperStyle = "absolute z-[200] top-5 sm:top-0 left-1/2 transform -translate-x-1/2" +
            " w-[19rem] sm:w-[22rem] max-w-[90%] sm:right-5 sm:left-auto sm:translate-x-0 sm:translate-y-[5%] " +
            "bottom-10 max-h-[40rem] min-h-[15rem]";


    // reset the tab to departure after switching a new airport from the Popular vatsim airports list.
    useEffect(() => {
        setActiveTab("departure");
    }, [airport]);

    useEffect(() => {
        if (!airport || !airport.ident) {
            return;
        }

        const fetchAirport = async () => {
            setLoading(true);
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
            setLoading(false);
        };

        fetchAirport();

        return () => {
            setArrivalTraffic(null);
            setDepartureTraffic(null);
        };
    }, [airport]);


    const renderContent = () => {
        switch (activeTab) {
        case "departure":
            return (
                <TrafficDetailList
                    flights={departureTraffic}
                    arrival={false}
                />
            );
        case "arrival":
            return (
                <TrafficDetailList
                    flights={arrivalTraffic}
                    arrival={true}
                />
            );
        case "info":
            return (
                <div>
                    <AirportDepartureArrivalPanelInfoTab airport={airport}/>
                </div>
            );
        default:
            return null;
        }
    };

    return (
        <div className={wrapperStyle}>
            {loading ? (
                <div>Loading data...</div>
            ) : (
                <div className="flex flex-col h-[90%] bg-gray-500 text-white rounded-lg overflow-hidden">
                    <div className="mb-1 p-1 bg-gray-500">
                        <AirportInfoSection airport={airport}/>
                    </div>
                    <AirportDepartureArrivalDisplay_TabButtonGroup onTabChange={setActiveTab}/>

                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-600">
                        {renderContent()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AirportDepartureArrivalDisplay;
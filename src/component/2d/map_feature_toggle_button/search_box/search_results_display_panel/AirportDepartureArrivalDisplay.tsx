import React, { useEffect, useState } from "react";
import { LocalDbAirport, VatsimFlight } from "../../../../../types";
import { CustomProvider } from "rsuite";
import { searchFlightsByAirports } from "../mapSearchFunction";
import TrafficDetailList from "./TrafficDetailList";
import AirportInfoSection from "./AirportInfoSection";
import AirportDepartureArrivalPanelInfoTab from "./AirportDepartureArrivalPanelInfoTab";
import AirportDepartureArrivalDisplay_TabButtonGroup from "./AirportDepartureArrivalDisplay_TabButtonGroup";

interface Props {
    airport: LocalDbAirport;
    // flights: VatsimFlight[];
}

const AirportDepartureArrivalDisplay = ({
    airport
}: Props) => {
    const [arrivalTraffic, setArrivalTraffic] = useState<VatsimFlight[]>(null);
    const [departureTraffic, setDepartureTraffic] = useState<VatsimFlight[]>(null);
    const [activeTab, setActiveTab] = useState("departure");

    const wrapperStyle = "absolute z-[200] top-5 sm:top-0 left-1/2 transform -translate-x-1/2" +
            " w-[19rem] sm:w-[22rem] max-w-[90%] sm:right-5 sm:left-auto sm:translate-x-0 sm:translate-y-[5%] " +
            "bottom-10 max-h-[40rem]";
    // const innerStyle =
    //         "relative text-white h-full max-h-[40rem] min-h-[20rem] " +
    //         "bg-gray-500 rounded-lg overflow-hidden flex flex-col";

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

    //flex-1 flex flex-col overflow-hidden
    return (
        <CustomProvider theme="light">
            <div className={wrapperStyle}>
                <div className="flex flex-col h-[90%] bg-gray-500 text-white">
                    <div className="mb-1 p-1 bg-gray-500">
                        <AirportInfoSection airport={airport}/>
                    </div>
                    <AirportDepartureArrivalDisplay_TabButtonGroup onTabChange={setActiveTab}/>
                    <div>
                        <TrafficDetailList
                            flights={arrivalTraffic}
                            arrival={true}
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {renderContent()}
                    </div>

                </div>
            </div>
        </CustomProvider>
    );
};

export default AirportDepartureArrivalDisplay;
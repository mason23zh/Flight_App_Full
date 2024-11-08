import React from "react";
import { PopularVatsimAirport } from "../../../../types";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";

// import { GiAirplaneDeparture, GiAirplaneArrival } from "react-icons/gi";


interface Props {
    featuredAirport: PopularVatsimAirport;
}

const serviceStyles = {
    DEL: "bg-blue-500",
    GND: "bg-green-500",
    TWR: "bg-red-500",
    APP: "bg-purple-500",
    ATIS: "bg-yellow-500",
};

const serviceLabels = {
    DEL: "D",
    GND: "G",
    TWR: "T",
    APP: "A",
    ATIS: "A",
};

const FeaturedAirportElement = ({ featuredAirport }: Props) => {
    const activeServices = Object.keys(featuredAirport.controller)
        .filter(service => featuredAirport.controller[service]);
    const {
        arrivalNumber,
        departureNumber
    } = featuredAirport;

    const arrivalTraffic = (arrivalNumber && arrivalNumber > 0)
        ? (
            <div className="flex items-center font-bold ">
                <FaPlaneArrival size={15}/>
                <div>{arrivalNumber}</div>
            </div>
        )
        : <></>;

    const departureTraffic = (departureNumber && departureNumber > 0)
        ? (
            <div className="flex items-center">
                <FaPlaneDeparture size={15}/>
                <div>{departureNumber}</div>
            </div>
        )
        : <></>;

    return (
        <div className="grid grid-cols-3 justify-between gap-4 p-2 bg-gray-600 border border-gray-700 shadow-sm rounded-lg">
            <div className="col-span-1 self-center">
                {featuredAirport.ICAO}
            </div>

            <div className="col-span-1 self-center">
                {featuredAirport.station?.country.country_name}
            </div>

            <div className="col-span-1 self-center">
                <div className={`flex flex-col items-center col-span-2 ${activeServices.length === 0 ? "justify-center" : "justify-between"}`}>
                    {/* Top section: Arrival and Departure Traffic */}
                    <div className="flex gap-2 mb-1">
                        {departureTraffic}
                        {arrivalTraffic}
                    </div>

                    {/* Bottom section: Controller Services (only shown if available) */}
                    {activeServices.length > 0 && (
                        <div className="flex w-full max-w-[150px] h-4 overflow-hidden justify-center">
                            {activeServices.map((service, index) => (
                                <span
                                    key={service}
                                    className={`flex items-center justify-center text-white font-bold text-xs px-[5px] py-1 ${
                                        serviceStyles[service]
                                    } ${
                                        activeServices.length === 1
                                            ? "rounded-l-lg rounded-r-lg" // If only one element, round both sides
                                            : index === 0
                                                ? "rounded-l-lg" // Round left edge for the first element
                                                : index === activeServices.length - 1
                                                    ? "rounded-r-lg" // Round right edge for the last element
                                                    : ""
                                    }`}
                                    title={service}
                                >
                                    {serviceLabels[service]}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeaturedAirportElement;
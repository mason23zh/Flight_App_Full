import React from "react";
import { PopularVatsimAirport } from "../../../../types";
import { GiAirplaneDeparture, GiAirplaneArrival } from "react-icons/gi";


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
            <div className="flex items-center gap-1 font-bold">
                <GiAirplaneArrival size={25}/>
                <div>{arrivalNumber}</div>
            </div>
        )
        : <></>;

    const departureTraffic = (departureNumber && departureNumber > 0)
        ? (
            <div className="flex items-center gap-1 font-bold">
                <GiAirplaneDeparture size={25}/>
                <div>{departureNumber}</div>
            </div>
        )
        : <></>;

    return (
        <div className="flex items-center gap-4 p-4 bg-gray-600 border border-gray-700 shadow-sm rounded-lg">
            <div>
                {featuredAirport.ICAO}
            </div>

            <div>
                {featuredAirport.station?.country.country_name}
            </div>

            <div className="flex w-25 h-5 rounded-lg overflow-hidden">
                {activeServices.map((service) => (
                    <span
                        key={service}
                        className={`flex-1 flex p-2 items-center justify-center text-white font-bold text-xs ${serviceStyles[service]}`}
                        title={service}
                    >
                        {serviceLabels[service]}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default FeaturedAirportElement;
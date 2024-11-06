import React from "react";
import { PopularVatsimAirport } from "../../../../types";

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
    DEL: "DEL",
    GND: "GND",
    TWR: "TWR",
    APP: "APP",
    ATIS: "ATIS",
};

const FeaturedAirportElement = ({ featuredAirport }: Props) => {
    const activeServices = Object.keys(featuredAirport.controller)
        .filter(service => featuredAirport.controller[service]);

    return (
        <div className="flex gap-2 items-center">
            <div>

                {featuredAirport.ICAO}
            </div>
            <div>
                {featuredAirport.station?.country.country_name || "/"}
            </div>
            <div>
                {featuredAirport.arrivalNumber}
            </div>
            <div className="flex w-32 h-8 rounded overflow-hidden">
                {activeServices.map((service) => (
                    <span
                        key={service}
                        className={`flex-1 flex items-center justify-center text-white font-bold text-xs ${serviceStyles[service]}`}
                    >
                        {serviceLabels[service]}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default FeaturedAirportElement;
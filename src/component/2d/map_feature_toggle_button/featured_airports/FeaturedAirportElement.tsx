import React from "react";
import { PopularVatsimAirport } from "../../../../types";

interface Props {
    featuredAirport: PopularVatsimAirport;
}

const FeaturedAirportElement = ({ featuredAirport }: Props) => {
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
        </div>
    );
};

export default FeaturedAirportElement;
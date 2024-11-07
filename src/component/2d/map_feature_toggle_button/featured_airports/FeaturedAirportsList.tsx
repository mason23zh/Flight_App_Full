import React from "react";
import { PopularVatsimAirportResponse } from "../../../../store/apis/airportsApi";
import FeaturedAirportElement from "./FeaturedAirportElement";

interface Props {
    featuredAirportsList: PopularVatsimAirportResponse;
}

const FeaturedAirportsList = ({ featuredAirportsList }: Props) => {
    let airportList;
    if (featuredAirportsList.data) {
        airportList = featuredAirportsList.data.airports.map((airport) => {
            return (
                <div key={airport.ICAO}>
                    <FeaturedAirportElement featuredAirport={airport}/>
                </div>
            );
        });
    } else {
        airportList = null;
    }

    return (
        <div className="flex flex-col gap-2">
            {airportList}
        </div>
    );
};

export default FeaturedAirportsList;
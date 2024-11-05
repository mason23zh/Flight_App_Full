import React from "react";
import { PopularAirportResponse, PopularVatsimAirportResponse } from "../../../../store/apis/airportsApi";
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
        <div>
            {airportList}
        </div>
    );
};

export default FeaturedAirportsList;
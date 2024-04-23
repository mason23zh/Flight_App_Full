import React from "react";
import { useFetchBasicAirportWithICAOQuery } from "../store";
import ExpandableContentAirportInfo from "./ExpandableContentAirportInfo";

function SubRowAsync({ row }) {
    const {
        data: airport,
        error,
        isFetching,
    } = useFetchBasicAirportWithICAOQuery(
        row.original.icao,
    );
     

    if (airport) {
        const airportData = airport.data[0];
        return (
            <ExpandableContentAirportInfo row={row} airportData={airportData}/>
        );
    }
    if (isFetching) {
        return (
            <div>Loading...</div>
        );
    }
    if (error) {
        return (
            <div>Something went wrong</div>
        );
    }
}

export default SubRowAsync;

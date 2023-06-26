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
        { refetchOnMountOrArgChange: true },
    );
    
    
    if (airport) {
        return (
            <ExpandableContentAirportInfo row={row} airportData={airport.data.airport[0]} />
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

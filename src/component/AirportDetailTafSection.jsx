import React, { useEffect, useState } from "react";
import { useFetchTafByICAOQuery } from "../store";

function AirportDetailTafSection({ icao }) {
    const {
        data: tafData,
        error: tafError,
        isFetching: tafFetching,
    } = useFetchTafByICAOQuery({ icao, decode: true });
    
    if (tafData) {
        console.log(tafData);
    } else if (tafFetching) {
        console.log(tafFetching);
    } else if (tafError) {
        console.log(tafError);
    }
    
    
    return (
        <div>
            TAF
        </div>
    );
}

export default AirportDetailTafSection;

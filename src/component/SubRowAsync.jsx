import React, { useEffect, useState } from "react";
import axios from "axios";
import ExpandableContent from "./ExpandableContent";

function SubRowAsync({ row }) {
    const [airportData, setAirportData] = useState(null);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        axios
            .get(`https://flight-data.herokuapp.com/api/v1/airports/icao/basic/${row.original.icao}`)
            .then((response) => setAirportData(response.data))
            .catch((err) => setError(err.messsage))
            .finally(() => setLoaded(true));
    }, [row]);
    
    if (airportData) {
        console.log("Airport:::::", airportData.data.airport);
    }
    
    if (airportData) {
        return (
            <ExpandableContent airportData={airportData.data.airport} error={error} loaded={loaded} row={row} />
        );
    }
}

export default SubRowAsync;

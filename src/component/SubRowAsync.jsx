import React, { useEffect, useState } from "react";
import axios from "axios";
import ExpandableContent from "./ExpandableContent";

function SubRowAsync({ row }) {
    const [airportData, setAirportData] = useState(null);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);
    
    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/v1/airports/icao/basic/${row.original.station_id}`)
            .then((response) => setAirportData(response.data))
            .catch((err) => setError(err.messsage))
            .finally(() => setLoaded(true));
    }, [row]);
    
    return (
        <ExpandableContent airportData={airportData?.data.airport} error={error} loaded={loaded} row={row} />
    );
}

export default SubRowAsync;

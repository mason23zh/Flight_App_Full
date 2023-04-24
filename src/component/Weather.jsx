import React, { useState } from "react";
import axios from "axios";
import backgroundImage from "../images/clearsky.jpg";
import HeroSection from "./HeroSection";

function Weather() {
    const [fetchedData, setFetchedData] = useState([]);

    const fetchData = async (userInput) => {
        const response = await axios.get(`http://localhost:8001/api/v1/airports/icao/${userInput}`);
        setFetchedData([]);
        // console.log(response.data.data.METAR);
        setFetchedData(response.data.data.METAR);
        return response.data.data;
    };
    console.log(fetchedData);

    const handleFormSubmit = (input) => {
        fetchData(input).catch((err) => console.error(err));
    };
    //
    // const renderedAirports = fetchedData?.map((airport) => {
    //     return <div>{airport.METAR}</div>;
    // });

    const message = "Current weather";
    const placeHolderMessage = "Search ICAO or airport name";
    return (
        <div>
            <HeroSection
                backgroundImage={backgroundImage}
                message={message}
                placedHoldMessage={placeHolderMessage}
                onSubmit={handleFormSubmit}
            />
            {/* {renderedAirports} */}
        </div>
    );
}

export default Weather;

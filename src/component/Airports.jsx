import React, { useState } from "react";
import axios from "axios";
import backgroundImage from "../images/mika-baumeister-DHlZenOMjJI-unsplash.jpg";
import HeroSection from "./HeroSection";
import AirportsList from "./AirportsList";
import { useFetchAirportsWithGenericInputQuery } from "../store";

function Airports() {
    const [fetchedData, setFetchedData] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [skipRender, setSkipRender] = useState(true);
    const message = "Airport information";
    const placeHolderMessage = "Search ICAO or airport name";
    
    const {
        data,
        error,
        isFetching,
    } = useFetchAirportsWithGenericInputQuery(userInput, { skip: skipRender });
    
    const handleOnSubmit = (input) => {
        setUserInput(input);
        setSkipRender(false);
    };
    
    let renderedAirport;
    if (data) {
        renderedAirport = <AirportsList airports={data} />;
    } else if (isFetching) {
        renderedAirport = <h1>Loading....</h1>;
    } else if (error) {
        renderedAirport = <h1>Error</h1>;
    } else {
        renderedAirport = <div className="text-center text-xl"><h1>Enter search query</h1></div>;
    }
    
    return (
        <div>
            <HeroSection
                backgroundImage={backgroundImage}
                message={message}
                placedHoldMessage={placeHolderMessage}
                onSubmit={handleOnSubmit}
            />
            {renderedAirport}
        </div>
    );
}

export default Airports;

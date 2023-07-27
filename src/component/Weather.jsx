import React, { useEffect, useState } from "react";
import backgroundImage from "../images/clearsky.jpg";
import HeroSection from "./HeroSection";
import { useFetchMetarByGenericInputQuery } from "../store";

function Weather() {
    const message = "Current weather";
    const placeHolderMessage = "Search ICAO or airport name";
    const [userInput, setUserInput] = useState();
    const [skipRender, setSkipRender] = useState(true);
    
    const {
        data,
        error,
        isFetching,
    } = useFetchMetarByGenericInputQuery({ data: userInput }, {
        skip: skipRender,
        refetchOnMountOrArgChange: true,
    });
    
    
    const handleFormSubmit = (input) => {
        setUserInput(input);
        setSkipRender(false);
    };
    
    if (data) {
        console.log(data);
    }
    
    
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

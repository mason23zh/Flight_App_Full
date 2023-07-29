import React, { useEffect, useState } from "react";
import backgroundImage from "../images/clearsky.jpg";
import HeroSection from "./HeroSection";
import { useFetchMetarByGenericInputQuery } from "../store";
import WeatherList from "./WeatherList";

function Weather() {
    const message = "Current weather";
    const placeHolderMessage = "Search ICAO, airport name or city...";
    const [userInput, setUserInput] = useState("");
    const [skipRender, setSkipRender] = useState(true);
    
    let renderedWeather;
    
    const {
        data,
        error,
        isFetching,
    } = useFetchMetarByGenericInputQuery({ data: userInput }, {
        skip: !userInput,
    });
    
    const handleFormSubmit = (input) => {
        setUserInput(input);
        setSkipRender(false);
    };
    
    
    if (error) {
        renderedWeather = <div className="text-xl text-center">No Results</div>;
    } else if (isFetching) {
        renderedWeather = <div className="text-cl text-center">Loading..</div>;
    } else if (data) {
        renderedWeather = <WeatherList weather={data} />;
    }
    
    return (
        <div>
            <HeroSection
                backgroundImage={backgroundImage}
                message={message}
                placedHoldMessage={placeHolderMessage}
                onSubmit={handleFormSubmit}
            />
            {renderedWeather}
        </div>
    );
}

export default Weather;

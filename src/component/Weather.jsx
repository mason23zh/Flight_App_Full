import React, { useEffect, useState } from "react";
import { CustomProvider } from "rsuite";
import backgroundImage from "../images/clearsky.jpg";
import backGroundImageDarkMode from "../images/nightSky.jpg";
import HeroSection from "./HeroSection";
import { useFetchMetarByGenericInputQuery } from "../store";
import WeatherList from "./WeatherList";
import { useTheme } from "../hooks/ThemeContext";

function Weather() {
    const darkMode = useTheme();
    const bgImg = darkMode ? backGroundImageDarkMode : backgroundImage;
    
    const message = "Current weather";
    const placeHolderMessage = "ICAO, name or city...";
    const [userInput, setUserInput] = useState("");
    const [skipRender, setSkipRender] = useState(true);
    const [weatherData, setWeatherData] = useState();
    
    let renderedWeather;
    
    const {
        data,
        error,
        isFetching,
    } = useFetchMetarByGenericInputQuery({ data: userInput }, {
        skip: !userInput,
    });
    
    // store data to localStorage to save the previous search results
    useEffect(() => {
        if (data) {
            setWeatherData(data);
            // localStorage.setItem("weatherListData", JSON.stringify(data));
        }
    }, [data]);
    
    if (weatherData) {
        localStorage.setItem("weatherListData", JSON.stringify(weatherData));
    }
    
    const handleFormSubmit = (input) => {
        setUserInput(input.trim());
        setSkipRender(false);
    };
    
    if (error) {
        renderedWeather = <div className="text-xl text-center"><h3>Error</h3></div>;
    } else if (isFetching) {
        renderedWeather = <div className="text-xl text-center">Loading..</div>;
    } else if (localStorage.getItem("weatherListData") !== null && !data) {
        const localData = JSON.parse(localStorage.getItem("weatherListData"));
        renderedWeather = <WeatherList weather={localData} />;
    } else if (data) {
        renderedWeather = <WeatherList weather={data} />;
    } else {
        renderedWeather = <div className="text-center text-xl"><h3>Enter search query</h3></div>;
    }
    
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div>
                <HeroSection
                    backgroundImage={bgImg}
                    message={message}
                    placedHoldMessage={placeHolderMessage}
                    onSubmit={handleFormSubmit}
                />
                {renderedWeather}
            </div>
        </CustomProvider>
    );
}

export default Weather;

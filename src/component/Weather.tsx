import { useEffect, useState } from "react";
import { CustomProvider } from "rsuite";
import backgroundImage from "../images/clearsky.jpg";
import backGroundImageDarkMode from "../images/nightSky.jpg";
import HeroSection from "./HeroSection";
import { useFetchMetarByGenericInputQuery } from "../store";
import WeatherList from "./WeatherList";
import { useTheme } from "../hooks/ThemeContext";
import { Helmet } from "react-helmet-async";

function Weather() {
    const darkMode = useTheme();
    const bgImg = darkMode ? backGroundImageDarkMode : backgroundImage;

    const message = "Current weather";
    const placeHolderMessage = "ICAO, name or city...";
    const [userInput, setUserInput] = useState("");
    const [weatherData, setWeatherData] = useState();

    let renderedWeather: JSX.Element;

    const {
        data,
        error,
        isFetching,
    } = useFetchMetarByGenericInputQuery({ data: userInput }, {
        skip: !userInput || userInput.trim() === "",
    });

    // store data to localStorage to save the previous search results
    useEffect(() => {
        if (data) {
            setWeatherData(data);
        }
    }, [data]);

    if (weatherData) {
        localStorage.setItem("weatherListData", JSON.stringify(weatherData));
    }

    const handleFormSubmit = (input: string) => {
        setUserInput(input.trim());
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
        renderedWeather = <div className="text-center text-xl flex-grow"><h3>Enter search query</h3></div>;
    }

    return (
        <>
            <Helmet>
                <title>Airport Weather Search | Real-Time METAR</title>
                <meta
                    name="description"
                    content="Search real-time airport weather by ICAO, name, or city. View raw and decoded METARs for accurate flight planning and virtual aviation."
                />
                <meta
                    name="keywords"
                    content="airport weather, METAR search, ICAO weather, decoded METAR, real-time aviation weather, flight planning, global airport weather"
                />
                <link rel="canonical" href="https://airportweather.org/weather" />
            </Helmet>
            <CustomProvider theme={darkMode ? "dark" : "light"}>
                <div className="flex flex-col flex-grow">
                    <HeroSection
                        backgroundImage={bgImg}
                        message={message}
                        placedHoldMessage={placeHolderMessage}
                        onSubmit={handleFormSubmit}
                    />
                    <div className="flex flex-grow flex-col">
                        {renderedWeather}
                    </div>
                </div>
            </CustomProvider>
        </>
    );
}

export default Weather;
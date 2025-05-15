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
                <title>Weather</title>
                <meta
                    name="description"
                    content="Search and explore real-time airport weather by ICAO code, airport name, city, or other criteria. View detailed METAR reports, including decoded METAR for easy interpretation. Quickly access airport-specific weather updates for accurate and reliable virtual aviation planning"
                />
                <meta
                    name="keyword"
                    content="Airport weather search, ICAO weather lookup, METAR reports, deocded METAR, real-time aviation weather, airport weather by city, airport weather by name, flight weather updates, global airport weather"
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
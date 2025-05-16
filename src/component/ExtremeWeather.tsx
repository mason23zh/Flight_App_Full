import { useEffect, useState } from "react";
import { CustomProvider } from "rsuite";
import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import ExtremeWeatherHeader from "./ExtremeWeatherHeader";
import { useTheme } from "../hooks/ThemeContext";
import ExtremeWeatherHeaderDropDown from "./ExtremeWeatherHeaderDropDown";
import WeatherTable from "./WeatherTable";
import { Helmet } from "react-helmet-async";

function ExtremeWeather() {
    const darkMode = useTheme();
    // number of weather to be requested, default to 20
    const [weatherDataNumber, setWeatherDataNumber] = useState(20);
    const [tableHeight, setTableHeight] = useState(0);

    useEffect(() => {
        const calculateTableHeight = () => {
            const headerHeight = document.getElementById("header")?.offsetHeight || 0;
            const heroHeight = 210;
            const footerHeight = document.getElementById("footer")?.offsetHeight || 0;
            const buttonHeight = document.getElementById("weather-table-button")?.offsetHeight || 0;
            const windowHeight = window.innerHeight;

            const availableHeight = windowHeight - headerHeight - heroHeight - footerHeight - buttonHeight;
            setTableHeight(availableHeight);
        };

        calculateTableHeight();
        window.addEventListener("resize", calculateTableHeight);

        return () => {
            window.removeEventListener("resize", calculateTableHeight);
        };
    }, []);

    const handleMoreDataClick = () => {
        setWeatherDataNumber((prev) => prev + 10);
    };

    const handleResetClick = () => {
        setWeatherDataNumber(10);
    };

    return (
        <>
            <Helmet>
                <title>Extreme Airport Weather | High Winds, Low Visibility & More</title>
                <meta
                    name="description"
                    content="Browse airport METARs with extreme and challenging weather. Sort by wind, gusts, viusibility, and more — ideal for flight simmers practicing in harsh conditions."
                />
                <link rel="canonical" href="https://airportweather.org/extreme-weather" />
            </Helmet>
            <CustomProvider theme={darkMode ? "dark" : "light"}>
                <div className={darkMode ? "bg-gray-400 flex-grow flex flex-col" : "bg-gray-200 flex flex-grow flex-col"}>
                    <div className="flex-grow">
                        <ExtremeWeatherHeroSection />
                        <div className="hidden transition-all ease-in-out md:block">
                            <ExtremeWeatherHeader />
                        </div>
                        <div className="transition-all ease-in-out md:hidden">
                            <ExtremeWeatherHeaderDropDown />
                        </div>
                    </div>
                    <div>
                        <WeatherTable tableHeight={tableHeight} requestNumber={weatherDataNumber}
                            darkTheme={darkMode} />
                    </div>
                    <div id="weather-table-button"
                        className={`py-1 shadow-md mt-auto mb-auto ${darkMode ? "bg-gray-600" : "bg-gray-200"}`}>
                        <div className="px-2 flex justify-center items-center">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`px-2 py-1 ${darkMode ? "bg-green-600" : "bg-green-400"} rounded-lg
                        text-sm hover:bg-amber-400 cursor-pointer`}
                                    onClick={handleMoreDataClick}
                                >
                                    Load More Data
                                </div>
                                <div
                                    className={`px-2 py-1 ${darkMode ? "bg-rose-600" : "bg-rose-400"} rounded-lg
                        text-sm hover:bg-amber-400 cursor-pointer`}
                                    onClick={handleResetClick}
                                >
                                    Set Default
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CustomProvider>
        </>
    );
}

export default ExtremeWeather;
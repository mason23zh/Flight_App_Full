import React, { useState } from "react";
import { CustomProvider } from "rsuite";
import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import ExtremeWeatherHeader from "./ExtremeWeatherHeader";
import WeatherTable from "./WeatherTable";
import SubRowAsync from "./SubRowAsync";
import { useTheme } from "../hooks/ThemeContext";
import ExtremeWeatherHeaderDropDown from "./ExtremeWeatherHeaderDropDown";
import WeatherTable2 from "./WeatherTable2";

function ExtremeWeather() {
    const darkMode = useTheme();
    const [weatherDataNumber, setWeatherDataNumber] = useState(10);
    const renderExpandedContent = React.useCallback(({ row }) => (
        <SubRowAsync
            row={row}
        />
    ), []);

    const handleMoreDataClick = () => {
        setWeatherDataNumber((prev) => prev + 10);
    };

    const handleResetClick = () => {
        setWeatherDataNumber(10);
    };

    return (
        <>
            <CustomProvider theme={darkMode ? "dark" : "light"}>
                <div className="flex-grow">
                    <div className={darkMode ? "bg-gray-400" : "bg-gray-200"}>
                        <ExtremeWeatherHeroSection/>
                        <>
                            <div className="hidden transition-all ease-in-out ExWeatherHeadMd:block">
                                <ExtremeWeatherHeader/>
                            </div>
                            <div className="transition-all ease-in-out ExWeatherHeadMd:hidden">
                                <ExtremeWeatherHeaderDropDown/>
                            </div>
                        </>
                    </div>
                    <WeatherTable2 requestNumber={weatherDataNumber}/>
                </div>
                <div className="relative bottom-0 left-0 right-0">
                    <div>
                        <div className="grid grid-rows-1 justify-items-center px-2 ">
                            <div className="justify-self-center flex items-center gap-3">
                                <div
                                    className="px-2 py-1 bg-green-500 rounded-lg
                                text-sm hover:bg-amber-400 cursor-pointer"
                                    onClick={handleMoreDataClick}
                                >
                                    Load More Data
                                </div>
                                <div
                                    className="px-2 py-1 bg-red-400 rounded-lg 
                                text-sm hover:bg-amber-400 cursor-pointer"
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

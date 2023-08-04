import React from "react";
import { CustomProvider } from "rsuite";
import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import ExtremeWeatherHeader from "./ExtremeWeatherHeader";
import WeatherTable from "./WeatherTable";
import SubRowAsync from "./SubRowAsync";
import { useTheme } from "../hooks/ThemeContext";

function ExtremeWeather() {
    const darkMode = useTheme();
    const renderExpandedContent = React.useCallback(({ row }) => (
        <SubRowAsync
            row={row}
        />
    ), []);
    
    return (
        <>
            <CustomProvider theme={darkMode ? "dark" : "light"}>
                <div className={darkMode ? "bg-gray-400" : "bg-gray-200"}>
                    <ExtremeWeatherHeroSection />
                    <ExtremeWeatherHeader />
                </div>
                <div className="flex justify-center items-center p-5">
                    <div className="table-auto w-auto">
                        <WeatherTable expandedContent={renderExpandedContent} />
                    </div>
                </div>
            </CustomProvider>
        </>
    );
}

export default ExtremeWeather;

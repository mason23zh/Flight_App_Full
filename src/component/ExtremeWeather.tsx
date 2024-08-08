import React from "react";
import { CustomProvider } from "rsuite";
import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import ExtremeWeatherHeader from "./ExtremeWeatherHeader";
import WeatherTable from "./WeatherTable";
import SubRowAsync from "./SubRowAsync";
import { useTheme } from "../hooks/ThemeContext";
import ExtremeWeatherHeaderDropDown from "./ExtremeWeatherHeaderDropDown";

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
                <div className="flex justify-center
                items-center max-w-[350px] sm:max-w-[950px]
                p-2 sm:p-5 ml-auto mr-auto">
                    <div className="overflow-auto">
                        <WeatherTable expandedContent={renderExpandedContent}/>
                    </div>
                </div>
            </CustomProvider>
        </>
    );
}

export default ExtremeWeather;

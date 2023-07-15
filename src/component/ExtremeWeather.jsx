import React from "react";
import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import ExtremeWeatherHeader from "./ExtremeWeatherHeader";
import WeatherTable from "./WeatherTable";
import SubRowAsync from "./SubRowAsync";

function ExtremeWeather() {
    const renderExpandedContent = React.useCallback(({ row }) => (
        <SubRowAsync
            row={row}
        />
    ), []);
    
    return (
        <>
            <div className="bg-gray-200 ">
                <ExtremeWeatherHeroSection />
                <ExtremeWeatherHeader />
            </div>
            <div className="flex justify-center items-center p-5">
                <div className="table-auto w-auto">
                    <WeatherTable expandedContent={renderExpandedContent} />
                </div>
            </div>
        </>
    );
}

export default ExtremeWeather;

import React from "react";
import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import ExtremeWeatherHeader from "./ExtremeWeatherHeader";
import MetarDisplayList from "./MetarDisplayList";
import WeatherTable from "./WeatherTable";

function ExtremeWeather() {
    return (
        <>
            <div className="bg-gray-200 ">
                <ExtremeWeatherHeroSection />
                <ExtremeWeatherHeader />
            </div>
            {/* <MetarDisplayList /> */}
            <WeatherTable />
        </>
    );
}

export default ExtremeWeather;

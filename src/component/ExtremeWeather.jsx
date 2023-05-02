import React, { useEffect, useState } from "react";
import axios from "axios";
import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import ExtremeWeatherHeader from "./ExtremeWeatherHeader";
import WeatherTable from "./WeatherTable";

function ExtremeWeather() {
    const expandedContent = React.useCallback(({ row, airportData }) => (
        <div>
            <h3>
                {row.original.raw_text}
            </h3>
            <h2>
                Name:
                {" "}
                {airportData?.airport.name}
            </h2>
        </div>
    ), []);
    
    
    return (
        <>
            <div className="bg-gray-200 ">
                <ExtremeWeatherHeroSection />
                <ExtremeWeatherHeader />
            </div>
            <div className="flex justify-center items-center p-5">
                <div className="table-auto w-auto">
                    <WeatherTable expandedContent={expandedContent} />
                </div>
            </div>
        </>
    );
}

export default ExtremeWeather;

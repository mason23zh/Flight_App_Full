import React from "react";
import WeatherAccordion from "./WeatherAccordion";

function WeatherList({ weather }) {
    let renderedWeather;
    
    if (!weather?.data || weather.data.length === 0) {
        localStorage.clear();
        renderedWeather = <div className="text-lg">No Results</div>;
    } else {
        renderedWeather = weather?.data.map((w) => (
            <div key={w.icao}>
                <WeatherAccordion weather={w} />
            </div>
        ));
    }
    
    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col gap-4 p-10 items-center w-[70%] items-stretch">
                {renderedWeather}
            </div>
        </div>
    );
}

export default WeatherList;

import React from "react";
import WeatherAccordion from "./WeatherAccordion";

function WeatherList({ weather }) {
    let renderedWeather;
    
    const { data } = weather;
    if (data.length === 0) {
        renderedWeather = <div className="text-lg">No Results</div>;
    } else {
        renderedWeather = data.map((w) => (
            <div key={w.icao}>
                <WeatherAccordion weather={w} />
            </div>
        ));
    }
    
    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col gap-4 p-10 items-center">
                {renderedWeather}
            </div>
        </div>
    );
}

export default WeatherList;

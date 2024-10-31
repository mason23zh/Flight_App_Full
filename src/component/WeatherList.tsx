import React, { ReactNode } from "react";
import WeatherAccordion from "./WeatherAccordion";

function WeatherList({ weather }) {
    let renderedWeather: ReactNode;

    if (!weather?.data || weather.data.length === 0) {
        renderedWeather = <div className="text-lg text-center">No Results</div>;
    } else {
        renderedWeather = weather?.data.map((w) => (
            <div key={w.icao}>
                <WeatherAccordion weather={w}/>
            </div>
        ));
    }


    return (
        <div className="flex flex-col items-center">
            <div className="w-auto flex flex-col gap-4 p-10 items-stretch sm:w-[70%]">
                {renderedWeather}
            </div>
        </div>
    );
}

export default WeatherList;

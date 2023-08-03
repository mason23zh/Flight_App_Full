import React from "react";
import WeatherTable from "./WeatherTable";

function About() {
    return (
        <div className="h-screen">
            <div className="flex flex-col items-center">
                <div className="text-red-500">
                    DISCLAIMER: NOT FOR REAL NAVIGATION
                </div>
                <div>
                    beta version 0.1
                </div>
            </div>
        </div>
    );
}

export default About;

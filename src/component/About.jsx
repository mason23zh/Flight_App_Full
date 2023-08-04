import React from "react";
import { CustomProvider } from "rsuite";
import WeatherTable from "./WeatherTable";
import { useTheme } from "../hooks/ThemeContext";


function About() {
    const darkMode = useTheme();
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
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
        </CustomProvider>
    );
}

export default About;

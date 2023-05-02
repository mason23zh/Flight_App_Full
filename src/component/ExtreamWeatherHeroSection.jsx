import React from "react";
import { useSelector } from "react-redux";
import backgroundImage from "../images/thunderstorm.jpg";

function ExtremeWeatherHeroSection() {
    const { weather, scope, code } = useSelector((state) => state.extremeWeather.userSelection);
    const tempScopeName = scope?.length > 0 ? scope.toLowerCase() : "Global";
    const scopeName = tempScopeName.charAt(0).toUpperCase() + tempScopeName.slice(1);
    console.log(weather, scope, code);
    return (
        <div className="relative">
            <div
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    height: "200px",
                    width: "auto",
                }}
            />
            <div
                className="absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%] text-cyan-50 flex flex-col justify-center items-center"
            >
                <h1 className="text-4xl">
                    {scopeName}
                    {" "}
                    Extreme Weather
                </h1>
                <h2 className="text-2xl">
                    Search
                    {" "}
                    {weather.includes("_") ? weather.replace("_", " ").toLowerCase() : weather.toLowerCase()}
                    {" for "}
                    {code.name ? code.name : "Global"}
                </h2>
            </div>
        </div>
    );
}

export default ExtremeWeatherHeroSection;

import React from "react";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import ExtremeWeatherHeroSectionScope from "./ExtremeWeatherHeroSectionScope";
import backgroundImage from "../images/thunderstorm.jpg";

function ExtremeWeatherHeroSection() {
    const {
        weather,
        scope,
        code
    } = useSelector((state: RootState) => state.extremeWeather.userSelection);
    const tempScopeName = scope?.length > 0 ? scope.toLowerCase() : "Global";
    const scopeName = tempScopeName.charAt(0)
        .toUpperCase() + tempScopeName.slice(1);

    return (
        <div className="relative">
            <div
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    height: "150px",
                    width: "auto",
                }}
            />
            <div
                className="absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%] text-cyan-50 "
            >
                <div className="grid grid-cols-1 justify-center items-center">
                    <h1 className="text-2xl text-center md:text-4xl
                    transition-all ease-in-out duration-300 "
                    >
                        {scopeName}
                        {" "}
                        Extreme Weather
                    </h1>
                    <h2 className="text-xl text-center md:text-3xl
                    transition-all ease-in-out duration-300"
                    >
                        <ExtremeWeatherHeroSectionScope code={code} weather={weather} scope={scope}/>
                    </h2>
                </div>
            </div>
        </div>
    );
}

export default ExtremeWeatherHeroSection;

import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import Dropdown from "./Dropdown";
import { useState } from "react";

const ExtremeWeather = () => {
    const [displayDropBox, setDisplayDropBox] = useState(false);
    const buttonClasses = "p-1 rounded text-blue-500 text-lg hover:text-white hover:bg-blue-500 duration-100";
    const scopeButtonClasses = "p-1 text-lg bg-amber-400 rounded text-gray-600 hover:bg-green-600 hover:text-white";

    const option = [
        { name: "Global", code: "GB" },
        { name: "Continents", code: "CT" },
        { name: "Country", code: "CY" },
    ];

    const handleClick = () => {
        setDisplayDropBox(true);
    };

    return (
        <>
            <div className="bg-gray-200 ">
                <ExtremeWeatherHeroSection />
                <div className="flex items-center justify-center gap-10 p-3 mt-1 relative">
                    <button className={buttonClasses}>Wind Speed</button>
                    <button className={buttonClasses}>Wind Gust</button>
                    <button className={buttonClasses}>Visibility</button>
                    <button className={buttonClasses}>Baro</button>
                    <button className={buttonClasses}>Temperature</button>
                    <button className={scopeButtonClasses}>Global</button>
                    <button className={scopeButtonClasses}>Country</button>
                    <button onClick={handleClick} className={scopeButtonClasses}>
                        Continent
                    </button>
                    <div>{displayDropBox && <Dropdown options={option} />}</div>
                </div>
            </div>
        </>
    );
};

export default ExtremeWeather;

import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import ExtremeWeatherHeader from "./ExtremeWeatherHeader";
import { useState } from "react";

const ExtremeWeather = () => {
    const [userSelection, setUserSelection] = useState({});
    // userSelection {weather: ..., scope: ..., option:...}
    const onUserSelection = (arg) => {
        const updatedState = {
            ...userSelection,
            ...arg,
        };
        setUserSelection(updatedState);
    };
    return (
        <>
            <div className="bg-gray-200 ">
                <ExtremeWeatherHeroSection keyword={userSelection?.scope} />
                <ExtremeWeatherHeader onSelection={onUserSelection} />
            </div>
        </>
    );
};

export default ExtremeWeather;

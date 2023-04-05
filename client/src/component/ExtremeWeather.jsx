import { COUNTRY_CODE } from "../util/country_code";
import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import Dropdown from "./Dropdown";
import { useState } from "react";

const ExtremeWeather = () => {
    const [selection, setSelection] = useState(null);

    const handleSelect = (option) => {
        setSelection(option);
    };

    const message = "Extreme weather";
    const placeHolderMessage = "Search country or continent";
    return (
        <div>
            <ExtremeWeatherHeroSection />
            {/*<div className="flex">*/}
            {/*    <Dropdown options={COUNTRY_CODE} onChange={handleSelect} value={selection} />*/}
            {/*</div>*/}
        </div>
    );
};

export default ExtremeWeather;

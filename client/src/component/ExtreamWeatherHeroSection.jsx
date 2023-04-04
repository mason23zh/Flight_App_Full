import { COUNTRY_CODE } from "../util/country_code";
import { useState } from "react";
import DropDownMenu from "./DropDownMenu";

const ExtremeWeatherHeroSection = () => {
    const [selected, setSelected] = useState(null);
    const [option, setOption] = useState(null);
    const handleSelect = (option) => {
        setOption(option);
    };
    return (
        <div>
            <form>
                <label>Country</label>
                <div>
                    <DropDownMenu options={COUNTRY_CODE} />
                </div>
            </form>
        </div>
    );
};

export default ExtremeWeatherHeroSection;

import { COUNTRY_CODE } from "../util/country_code";
import { useState } from "react";
import DropDownMenu from "./DropDownMenu";

const ExtremeWeatherHeroSection = () => {
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

import React from "react";
import ReactCountryFlag from "react-country-flag";
import { CONTINENT, COUNTRY, GLOBAL } from "../util/selection_names";

function ExtremeWeatherHeroSectionScope({ code, weather, scope }) {
    if (code.label) {
        if (scope === COUNTRY) {
            return (
                <div className="flex items-center justify-center gap-2">
                    <div>
                        Search
                        {" "}
                        {weather.includes("_") ? weather.replace("_", " ")
                            .toLowerCase() : weather.toLowerCase()}
                        {" for "}
                    </div>
                    <div>
                        {code.label}
                    </div>
                    <ReactCountryFlag className="rounded-3xl" countryCode={code.value.toUpperCase()} svg />
                </div>
            );
        }
        
        if (scope === CONTINENT) {
            return (
                <div className="flex items-center justify-center gap-2 relative">
                    <div>
                        Search
                        {" "}
                        {weather.includes("_") ? weather.replace("_", " ")
                            .toLowerCase() : weather.toLowerCase()}
                        {" for "}
                    </div>
                    <div>
                        {code.label}
                    </div>
                </div>
            );
        }
        
        if (scope === GLOBAL) {
            return (
                <div className="flex items-center justify-center gap-2">
                    <div>
                        Search
                        {" "}
                        {weather.includes("_") ? weather.replace("_", " ")
                            .toLowerCase() : weather.toLowerCase()}
                        {" for "}
                    </div>
                    <div>
                        {code.label}
                    </div>
                    <ReactCountryFlag className="rounded-xl" countryCode={code.value.toUpperCase()} svg />
                </div>
            );
        }
    }
    
    return (
        <div>
            Search
            {" "}
            {weather.includes("_") ? weather.replace("_", " ")
                .toLowerCase() : weather.toLowerCase()}
            {" for "}
            Global
        </div>
    );
}

export default ExtremeWeatherHeroSectionScope;

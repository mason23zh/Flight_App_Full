import ReactCountryFlag from "react-country-flag";
import { CONTINENT, COUNTRY, GLOBAL } from "../util/selection_names";
import { capitalizeAllLetter, capitalizeFirstLetter } from "../util/stringCapitalize";

function ExtremeWeatherHeroSectionScope({ code, weather, scope }) {
    if (code.label) {
        if (scope === COUNTRY) {
            return (
                <div className="flex items-center justify-center gap-2">
                    <div>
                        {weather.includes("_")
                            ? capitalizeAllLetter(weather.replace("_", " ").toLowerCase())
                            : capitalizeAllLetter(weather.toLowerCase())}
                    </div>
                    <div>|</div>
                    <div className="align-bottom">
                        <ReactCountryFlag
                            className="rounded-3xl"
                            countryCode={code.value.toUpperCase()}
                            svg
                        />
                    </div>
                </div>
            );
        }

        if (scope === CONTINENT) {
            return (
                <div className="flex items-center justify-center gap-2 relative">
                    <div>
                        {" "}
                        {weather.includes("_")
                            ? capitalizeAllLetter(weather.replace("_", " ").toLowerCase())
                            : capitalizeAllLetter(weather.toLowerCase())}
                        {" for "}
                    </div>
                    <div>{code.label}</div>
                </div>
            );
        }

        if (scope === GLOBAL) {
            return (
                <div className="flex items-center justify-center gap-2 font-Rubik">
                    <div>
                        Search{" "}
                        {weather.includes("_")
                            ? capitalizeAllLetter(weather.replace("_", " ").toLowerCase())
                            : capitalizeAllLetter(weather.toLowerCase())}
                        {" for "}
                    </div>
                    <div>{code.label}</div>
                    <ReactCountryFlag
                        className="rounded-xl"
                        countryCode={code.value.toUpperCase()}
                        svg
                    />
                </div>
            );
        }
    }

    return (
        <div className="font-Rubik">
            Search{" "}
            {weather.includes("_")
                ? capitalizeAllLetter(weather.replace("_", " ").toLowerCase())
                : capitalizeAllLetter(weather.toLowerCase())}
            {scope && (
                <>
                    {" for "}
                    {capitalizeFirstLetter(scope.toLowerCase())}
                </>
            )}
        </div>
    );
}

export default ExtremeWeatherHeroSectionScope;

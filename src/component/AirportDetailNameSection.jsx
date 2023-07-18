import React from "react";
import ReactCountryFlag from "react-country-flag";

function AirportDetailNameSection({ name, icao, countryCode }) {
    return (
        <div className="flex flex-row text-2xl gap-2 items-center">
            <div>
                <ReactCountryFlag
                    countryCode={countryCode.toUpperCase()}
                    style={{ fontSize: "1.5em", lineHeight: "1.5em" }}
                    className="rounded-3xl"
                    svg
                />
            </div>
            <div>
                {name} / {icao}
            </div>
        </div>
    );
}

export default AirportDetailNameSection;

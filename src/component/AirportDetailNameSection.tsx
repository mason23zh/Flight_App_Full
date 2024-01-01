import React from "react";
import ReactCountryFlag from "react-country-flag";
 
function AirportDetailNameSection({
    name,
    icao,
    countryCode
}) {
    return (
        <div className="text-xl gap-1 items-center grid grid-rows-2 md:flex md:flex-row md:gap-2 md:text-2xl ">
            <div>
                <ReactCountryFlag
                    countryCode={countryCode.toUpperCase()}
                    style={{
                        fontSize: "1.5em",
                        lineHeight: "1.5em"
                    }}
                    className="rounded-2xl md:rounded-3xl"
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

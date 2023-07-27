import React from "react";

function AirportDetailTable({
    ICAO,
    iata,
    region,
    country,
    runwayCount,
    airportType,
    elevation,
    transitionAltitude,
    lng,
    lat,
    homeLink,
    wikiLink,
}) {
    return (
        <div className="overflow-x-auto md:-mx-6 lg:-mx-8">
            <table className="text-sm w-full mt-2 mb-2">
                <tbody>
                    <tr className="border-2 text-left">
                        <td className="border-2  p-3">ICAO</td>
                        <td className="p-3">{ICAO}</td>
                    </tr>
                    <tr className="border-2 text-left">
                        <td className="border-2 p-3 ">IATA</td>
                        <td className="p-3">{iata}</td>
                    </tr>
                    <tr className="border-2 text-left">
                        <td className="border-2 p-3">Region</td>
                        <td className="p-3">{region}</td>
                    </tr>
                    <tr className="border-2 text-left">
                        <td className="border-2 p-3">Country</td>
                        <td className="p-3">{country}</td>
                    </tr>
                    <tr className="border-2 text-left">
                        <td className="border-2 p-3">Number of runways</td>
                        <td className="p-3">{runwayCount}</td>
                    </tr>
                    <tr className="border-2 text-left">
                        <td className="border-2 p-3">Elevation</td>
                        <td className="p-3">{elevation} ft</td>
                    </tr>
                    <tr className="border-2 text-left">
                        <td className="border-2 p-3">Transition Altitude</td>
                        <td className="p-3">{transitionAltitude === 0 ? "Not Available" : `${transitionAltitude} ft`}</td>
                    </tr>
                    <tr className="border-2 text-left">
                        <td className="border-2 p-3">Type</td>
                        <td className="p-3">{airportType.includes("_") ? airportType.replace("_", " ") : airportType}</td>
                    </tr>
                    <tr className="border-2 text-left">
                        <td className="border-2 p-3">Coordinates</td>
                        <td className="p-3">{lat}, {lng}</td>
                    </tr>
                    <tr className="border-2 text-left">
                        <td className="border-2 p-3">Home Page</td>
                        <td className="p-3"><a href={homeLink}>{homeLink}</a></td>
                    </tr>
                    <tr className="border-2 text-left">
                        <td className="border-2 p-3">Wikipedia Page</td>
                        <td className="p-3 width-[0.1%] whitespace-nowrap"><a href={wikiLink}>{wikiLink}</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default AirportDetailTable;
 
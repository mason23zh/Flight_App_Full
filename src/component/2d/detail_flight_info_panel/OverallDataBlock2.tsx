import React from "react";
import FlightProgressBar from "./FlightProgressBar";

const OverallDataBlock2 = ({
    aircraft,
    callsign,
    depAirport,
    arrAirport,
    etd,
    enroute,
    progress
}) => {
    console.log("dep arr:", depAirport);

    function calculateArrivalTime(etd: string, enroute: string) {
        // Convert ETD to minutes
        const etdHours = parseInt(etd.substr(0, 2), 10);
        const etdMinutes = parseInt(etd.substr(2, 2), 10);
        const etdTotalMinutes = etdHours * 60 + etdMinutes;

        // Convert enroute time to minutes
        const enrouteHours = parseInt(enroute.substr(0, 2), 10);
        const enrouteMinutes = parseInt(enroute.substr(2, 2), 10);
        const enrouteTotalMinutes = enrouteHours * 60 + enrouteMinutes;

        // Calculate total arrival time in minutes
        const totalMinutes = etdTotalMinutes + enrouteTotalMinutes;

        // Convert total minutes back to 24-hour format
        const arrivalHours = Math.floor(totalMinutes / 60) % 24; // Using % 24 to convert hours into 24-hour format
        const arrivalMinutes = totalMinutes % 60;

        // Format the hours and minutes to always have two digits
        const formattedHours = arrivalHours.toString()
            .padStart(2, "0");
        const formattedMinutes = arrivalMinutes.toString()
            .padStart(2, "0");

        return `${formattedHours}${formattedMinutes}`;
    }


    // if (depAirport.data[0] && arrAirport.data[0]) {

    return (
        <div className="container">
            {/*
                     Callsign and aircraft type
                     */}
            <div className="grid grid-rows-2">
                <div className="grid grid-rows-2 bg-gray-500 p-2">
                    <div className="text-yellow-500 font-bold text-xl font-Rubik">
                        {callsign}
                    </div>
                    <div className="text-white font-bold text-md font-Rubik">
                        {aircraft || "N/A"}
                    </div>
                </div>
                {/*
                         Departure and Arrival Airport
                         */}
                <div className="grid grid-cols-2 bg-gray-200">
                    <div className="grid grid-rows-2 justify-items-center border-r p-3 bg-gray-300">
                        <div className="text-xl font-bold">
                            {depAirport.data[0]?.ICAO || "N/A"}
                        </div>
                        <div className="text-lg w-auto truncate max-w-[200px]">
                            {depAirport.data[0]?.station.city || "N/A"}
                        </div>
                    </div>
                    <div className="grid grid-rows-2 justify-items-center p-3 border-l bg-gray-300">
                        <div className="text-xl font-bold">
                            {arrAirport.data[0]?.ICAO || "N/A"}
                        </div>
                        <div className="text-lg w-auto truncate max-w-[200px]">
                            {arrAirport.data[0]?.station.city || "N/A"}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 bg-gray-200 border-t-2 font-bold font-Rubik">
                    <div className="flex justify-between p-2 bg-gray-400 border-r">
                        <div>SCHEDULE</div>
                        <div>
                            {etd || "N/A"}
                        </div>
                    </div>
                    <div className="flex justify-between bg-gray-400 p-2">
                        <div>SCHEDULE</div>
                        <div>
                            {etd && enroute
                                ? calculateArrivalTime(etd, enroute)
                                : "N/A"
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-300 p-2">
                <div className="grid grid-cols-[auto,1fr,auto] items-center font-bold font-Rubik">
                    <div className="whitespace-nowrap">
                        {depAirport.data[0]?.iata || "N/A"}
                    </div>
                    <div className="mx-2">
                        {
                            progress !== -1
                                ? <FlightProgressBar progress={progress}/>
                                : <div className="text-center">
                                    Progress N/A
                                </div>
                        }
                    </div>
                    <div className="whitespace-nowrap">
                        {arrAirport.data[0]?.iata || "N/A"}
                    </div>
                </div>
            </div>
        </div>
    );
};
// };

export default OverallDataBlock2;
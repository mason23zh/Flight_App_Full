import React from "react";
import VatsimAirportInfoTab from "./VatsimAirportInfoTab";

function HomeVatsimAirportsList({ airports }) {
    const { data } = airports;
    let renderedAirports;
    
    if (data.airports.length === 0) {
        renderedAirports = <div className="text-lg text-center">No Results</div>;
    } else {
        renderedAirports = data.airports.map((airport, i) => (
            <div key={airport.ICAO}>
                <VatsimAirportInfoTab airport={airport} counter={i} />
            </div>
        ));
    }
    
    return (
        <div className="mt-3 ml-10 mr-10 sm:ml-20 sm:mr-20">
            <div className="grid grid-cols-1 gap-5 auto-rows-fr p-2 ml-30 mr-30">
                {renderedAirports}
            </div>
        </div>
    );
}

export default HomeVatsimAirportsList;

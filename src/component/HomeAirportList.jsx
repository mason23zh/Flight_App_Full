import React from "react";
import AirportAccordion from "./AirportAccordion";
import HomeAirportAccordion from "./HomeAirportAccordion";

function HomeAirportList({ airports }) {
    const { data } = airports;
    let renderedAirports;
    if (data.length === 0) {
        renderedAirports = <div className="text-lg">No Results</div>;
    } else {
        renderedAirports = data.slice(0, 6).map((airport) => (
            <div key={airport.ICAO}>
                <HomeAirportAccordion airport={airport} />
            </div>
        ));
    }
    
    return (
        <div className="max-w-6xl mt-3 ml-20 mr-20">
            <div className="mt-3 p-3 grid grid-cols-1 gap-10
            sm:grid-cols-2 md:grid-cols-3"
            >
                {renderedAirports}
            </div>
        </div>
    );
}

export default HomeAirportList;

import React from "react";

function ExpandableContentAirportInfo({ row, airportData }) {
    console.log(airportData);
    const renderedRunways = airportData.runways.map((runway) => (
        <div key={runway._id} className="p-3 flex flex-col ">
            <div>
                Runway {runway.runway_id}
            </div>
            <div>
                Heading: {runway.runwayHdg}
            </div>
            <div>
                Length: {runway.runwayLength} ft
            </div>
            <div>
                Width: {runway.runwayWidth} ft
            </div>
            <div>
                ILS:
                {" "}
                {runway.runway_ils_avl === 0 ? "Not Available" : runway.ilsFreq}
            </div>
            <div>
                {runway.runway_ils_avl === 0 ? "" : `ILS Course: ${runway.ilsHdg}`}
            </div>
        </div>
    ));
    
    return (
        <div className="p-3 text-lg">
            <div className="flex flex-col justify-center items-center">
                <div>
                    Raw Metar: {row.original.raw_text}
                </div>
                <div>
                    Elevation: {airportData.elevation} ft
                </div>
                <div>
                    Transition Altitude: {airportData.transitionAltitude} ft
                </div>
            </div>
            <div className="grid grid-cols-2 justify-center justify-items-center ">
                {renderedRunways}
            </div>
        </div>
    );
}

export default ExpandableContentAirportInfo;

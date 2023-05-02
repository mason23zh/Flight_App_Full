import React from "react";

function ExpandableContent({
    airportData, error, loaded, row, 
}) {
    console.log("DATA from expandable content com:", airportData, error, loaded);
    if (error) {
        return (
            <div>Error</div>
        );
    }
    
    if (!loaded) {
        return (
            <div>Loading...</div>
        );
    }
    
    return (
        <div>
            Raw Metar: 
            {" "}
            {row.original.raw_text}
            Airport Data:
            {" "}
            {airportData.ICAO}
        </div>
    );
}

export default ExpandableContent;

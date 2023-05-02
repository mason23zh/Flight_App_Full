import React from "react";
import ExpandableContentAirportInfo from "./ExpandableContentAirportInfo";

function ExpandableContent({
    airportData, error, loaded, row,
}) {
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
        <ExpandableContentAirportInfo row={row} airportData={airportData} />
    );
}

export default ExpandableContent;

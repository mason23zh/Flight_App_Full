/*
 Detailed airport information triggered by clicking "Go to Airport" button
 in AirportAccordion
 * */
import React from "react";
import { useLocation } from "react-router-dom";

function AirportDetail() {
    const location = useLocation();
    const { airportData } = location.state;
    console.log(airportData);
    return (
        <div>
            This is a Airport Detail page
        </div>
    );
}

export default AirportDetail;

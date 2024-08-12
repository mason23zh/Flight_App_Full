import React, { useEffect, useState } from "react";
import { LiveFlightData } from "../types";


const FlightTracker = () => {
    const [flightData, setFlightData] = useState<LiveFlightData>({
        latitude: null,
        longitude: null,
        heading: null,
        groundspeed: null,
        MSL: null,
    });

    useEffect(() => {
        // Note: This will only work when the web app and local server are running on the same machine
        const ws = new WebSocket("ws://localhost:49153");

        ws.onmessage = (event) => {
            const data: LiveFlightData = JSON.parse(event.data);
            setFlightData(data);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => ws.close();
    }, []);

    return (
        <div>
            <h1>Flight Tracker</h1>
            <div>
                <p>Latitude: {flightData.latitude}</p>
                <p>Longitude: {flightData.longitude}</p>
                <p>Heading: {flightData.heading}</p>
                <p>Groundspeed: {flightData.groundspeed}</p>
                <p>Altitude(MSL): {flightData.MSL}</p>
                <p>Altitude(AGL): {flightData.AGL}</p>
                <p>Heading(mag): {flightData.heading}</p>
                <p>Heading(true): {flightData.true_heading}</p>
                <p>Airspeed(ind): {flightData.indicated_airspeed}</p>
                <p>Airspeed(true):{flightData.true_airspeed}</p>
                <p>Groundspeed: {flightData.groundspeed}</p>
                <p>Pitch: {flightData.pitch}</p>
                <p>Roll: {flightData.roll}</p>
                <p>Vertical Speed: {flightData.vertical_speed}</p>
            </div>
        </div>
    );
};

export default FlightTracker;
import React, { useEffect, useState } from "react";

interface FlightData {
    latitude: number | null;
    longitude: number | null;
    heading: number | null;
    groundspeed: number | null;
    altitude: number | null;
}

const FlightTracker = () => {
    const [flightData, setFlightData] = useState<FlightData>({
        latitude: null,
        longitude: null,
        heading: null,
        groundspeed: null,
        altitude: null,
    });

    useEffect(() => {
        // Note: This will only work when the web app and local server are running on the same machine
        const ws = new WebSocket("ws://localhost:6789");

        ws.onmessage = (event) => {
            const data: FlightData = JSON.parse(event.data);
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
                <p>Altitude: {flightData.altitude}</p>
            </div>
        </div>
    );
};

export default FlightTracker;
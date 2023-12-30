import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import axios from "axios";

// mapboxgl.accessToken = "pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA";
mapboxgl.accessToken = "pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA";


function DeckGlTest3() {
    const [aircraftData, setAircraftData] = useState([]);
    const mapContainer = useRef(null);
    const map = useRef(null);
    
    const updateAircraftPositions = (data) => {
        if (map.current.getSource("aircraft")) {
            map.current.getSource("aircraft").setData({
                type: "FeatureCollection",
                features: data.map((aircraft) => ({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [aircraft.longitude, aircraft.latitude, aircraft.altitude * 0.3048],
                    },
                    properties: {
                        id: aircraft.callsign,
                    },
                })),
            });
        } else {
            map.current.addSource("aircraft", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: data.map((aircraft) => ({
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [aircraft.longitude, aircraft.latitude, aircraft.altitude * 0.3048],
                        },
                        properties: {
                            id: aircraft.callsign,
                        },
                    })),
                },
            });
            
            map.current.addLayer({
                id: "aircraft",
                type: "circle",
                source: "aircraft",
                paint: {
                    "circle-radius": 5,
                    "circle-color": "#007cbf",
                },
            });
        }
    };
    
    const fetchDataAndUpdateMap = async () => {
        try {
            const response = await axios.get("https://data.vatsim.net/v3/vatsim-data.json");
            setAircraftData(response.data.pilots); // Assuming the data is an array of aircraft positions
            updateAircraftPositions(response.data.pilots);
        } catch (error) {
            console.error("Error fetching aircraft data:", error);
        }
    };
    
    useEffect(() => {
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mason-zh/clqq37e4c00k801p586732u2h", // Choose a style that supports 3D terrain
            center: [0, 0], // Initial position
            zoom: 1, // Initial zoom
            pitch: 0,
            bearing: 0,
            antialias: true,
            projection: "globe", // Set the map projection to 'globe'
        });
        
        map.current.on("load", () => {
            map.current.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 }); // Enable terrain elevation
            fetchDataAndUpdateMap();
        });
    }, []);
    
    useEffect(() => {
        const intervalId = setInterval(fetchDataAndUpdateMap, 15000); // 15000 milliseconds = 15 seconds
        return () => clearInterval(intervalId);
    }, []);
    
    return <div ref={mapContainer} style={{ height: "100vh", width: "100%" }} />;
}

export default DeckGlTest3;

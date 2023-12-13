/* eslint-disable no-mixed-operators,prefer-destructuring */
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import { ScatterplotLayer, LineLayer } from "@deck.gl/layers";
import axios from "axios";

const DATA_URL = "https://api.airportweather.org/v1/vatsim/getAllTraffics";
const MODEL_URL = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scenegraph-layer/airplane.glb";
const REFRESH_TIME = 30000;

const ANIMATIONS = {
    "*": { speed: 1 },
};

const INITIAL_VIEW_STATE = {
    latitude: 39.1,
    longitude: -94.57,
    zoom: 3.8,
    maxZoom: 16,
    pitch: 0,
    bearing: 0,
};

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

const DATA_INDEX = {
    UNIQUE_ID: 0,
    CALL_SIGN: 1,
    ORIGIN_COUNTRY: 2,
    LONGITUDE: 5,
    LATITUDE: 6,
    BARO_ALTITUDE: 7,
    VELOCITY: 9,
    TRUE_TRACK: 10,
    VERTICAL_RATE: 11,
    GEO_ALTITUDE: 13,
    POSITION_SOURCE: 16,
};

function getTooltip({ object }) {
    return (
        object
            && `\
    Call Sign: ${object.callsign || ""}
    Departure: ${object.departure || ""}
    Vertical Rate: ${object.track[0].groundSpeed || 0} m/s
    Velocity: ${object.track[0].groundSpeed || 0} m/s
    Direction: ${object.track[0].heading || 0}`
    );
}

export default function App({ sizeScale = 25, onDataLoad, mapStyle = MAP_STYLE }) {
    const [data, setData] = useState(null);
    const [trackData, setTrackData] = useState(null);
    const [selectTraffic, setSelectTraffic] = useState(null);
    const formatTrack = [];
    
    useEffect(() => {
        const getTrackData = async () => {
            if (selectTraffic) {
                const res = await axios.get(`https://api.airportweather.org/v1/vatsim/getTrafficByCallsign/track/${selectTraffic.callsign}`);
                console.log("path:", res);
                if (res) {
                    setTrackData(res.data.data);
                }
            }
        };
        getTrackData();
    }, [selectTraffic]);
    
    useEffect(() => {
        const getTrafficData = async () => {
            const res = await axios.get(DATA_URL);
            if (res) {
                console.log(res.data.data.results);
                setData(res.data.data.traffics);
            }
        };
        getTrafficData();
        const interval = setInterval(() => getTrafficData(), 20000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    
    if (trackData) {
        trackData.track.map(async (t, idx) => {
            // console.log("track data", t);
            const tempObj = { from: { coordinates: [] }, to: { coordinates: [] } };
            if (idx < trackData.track.length - 1) {
                tempObj.from.coordinates[0] = t.longitude;
                tempObj.from.coordinates[1] = t.latitude;
                tempObj.from.coordinates[2] = t.altitude;
                tempObj.to.coordinates[0] = trackData.track[idx + 1].longitude;
                tempObj.to.coordinates[1] = trackData.track[idx + 1].latitude;
                tempObj.to.coordinates[2] = trackData.track[idx + 1].altitude;
                formatTrack.push(tempObj);
            } else if (idx === trackData.track.length - 1) {
                tempObj.to.coordinates[0] = selectTraffic.track[0].longitude;
                tempObj.to.coordinates[1] = selectTraffic.track[0].latitude;
                tempObj.to.coordinates[2] = selectTraffic.track[0].altitude;
                tempObj.from.coordinates[0] = t.longitude;
                tempObj.from.coordinates[1] = t.latitude;
                tempObj.from.coordinates[2] = t.altitude;
                formatTrack.push(tempObj);
            }
        });
    }
    
    const onClick = (info) => {
        console.log("click info", info.object);
        setSelectTraffic(info.object);
    };
    
    const flightPathLayer = new LineLayer({
        id: "flight-path",
        data: formatTrack,
        
        /* props from LineLayer class */
        
        getColor: (d) => [255, 140, 0],
        getSourcePosition: (d) => d.from.coordinates,
        getTargetPosition: (d) => d.to.coordinates,
        getWidth: 5,
        widthMaxPixels: Number.MAX_SAFE_INTEGER,
        widthMinPixels: 0,
        widthScale: 1,
        widthUnits: "pixels",
        
        /* props inherited from Layer class */
        
        // autoHighlight: false,
        // coordinateOrigin: [0, 0, 0],
        // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        highlightColor: [0, 0, 128, 128],
        modelMatrix: null,
        opacity: 1,
        pickable: true,
        visible: true,
        wrapLongitude: false,
    });
    
    const trafficLayer = data
            && new ScenegraphLayer({
                id: "traffics-layer",
                data,
                pickable: true,
                sizeScale,
                scenegraph: MODEL_URL,
                _animations: ANIMATIONS,
                sizeMinPixels: 0.3,
                sizeMaxPixels: 0.5,
                getPosition: (d) => [
                    d.track[0].longitude || 0,
                    d.track[0].latitude || 0,
                    d.track[0].altitude || 0,
                ],
                getOrientation: (d) => [0, -d.track[0].heading || 0, 90],
                onClick,
            });
    
    return (
        <DeckGL
            layers={[flightPathLayer, trafficLayer]}
            initialViewState={INITIAL_VIEW_STATE}
            controller
            getToolTip={getTooltip}
        >
            <Map reuseMaps mapLib={maplibregl} mapStyle={mapStyle} preventStyleDiffing />
        </DeckGL>
    );
}

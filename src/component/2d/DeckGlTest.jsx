/* eslint-disable no-mixed-operators,prefer-destructuring,react/no-this-in-sfc,react/destructuring-assignment */
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import { ScatterplotLayer, LineLayer } from "@deck.gl/layers";
import axios from "axios";
import { TileLayer } from "react-leaflet";
import { CesiumIonLoader } from "@loaders.gl/3d-tiles";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import mapStyles from "../../assets/mapbox/style.json";


const DATA_URL = "https://data.vatsim.net/v3/vatsim-data.json";
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

// const INITIAL_VIEW_STATE = {
//     latitude: 51.47,
//     longitude: 0.45,
//     zoom: 4,
//     bearing: 0,
//     pitch: 30,
// };

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";
// const MAP_STYLE = "mapbox://styles/mason-zh/clq4prjet018v01qj2rkt4a6b";
// const MAP_STYLE = "mapbox://styles/mason-zh/clq4q162t01al01pg0jo696fa";
// const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

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
    console.log("pickale", object);
    return (
        object && `${object.callsign}`
    );
}

export default function App({ sizeScale = 25, onDataLoad, mapStyle = MAP_STYLE }) {
    const [data, setData] = useState(null);
    const [trackData, setTrackData] = useState(null);
    const [selectTraffic, setSelectTraffic] = useState(null);
    const [hoverInfo, setHoverInfo] = useState(null);
    const formatTrack = [];
    
    useEffect(() => {
        console.log("hover info:", hoverInfo);
    }, [hoverInfo]);
    
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
                console.log(res.data.pilots);
                setData(res.data.pilots);
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
            if (!t.longitude) {
                return;
            }
            if (idx < trackData.track.length - 1) {
                tempObj.from.coordinates[0] = t.longitude;
                tempObj.from.coordinates[1] = t.latitude;
                tempObj.from.coordinates[2] = t.altitude;
                tempObj.to.coordinates[0] = trackData.track[idx + 1].longitude;
                tempObj.to.coordinates[1] = trackData.track[idx + 1].latitude;
                tempObj.to.coordinates[2] = trackData.track[idx + 1].altitude;
                formatTrack.push(tempObj);
            } else if (idx === trackData.track.length - 1) {
                // get the latest data and update the track
                if (selectTraffic && data) {
                    const selectedObj = data.find((o) => o.callsign === selectTraffic.callsign);
                    tempObj.to.coordinates[0] = selectedObj.longitude;
                    tempObj.to.coordinates[1] = selectedObj.latitude;
                    tempObj.to.coordinates[2] = selectedObj.altitude;
                    tempObj.from.coordinates[0] = t.longitude;
                    tempObj.from.coordinates[1] = t.latitude;
                    tempObj.from.coordinates[2] = t.altitude;
                    formatTrack.push(tempObj);
                }
            }
        });
    }
    
    const onClick = (info) => {
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
        pickable: false,
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
                sizeMinPixels: 0.4,
                sizeMaxPixels: 0.5,
                getPosition: (d) => [
                    d.longitude || 0,
                    d.latitude || 0,
                    d.altitude || 0,
                ],
                getOrientation: (d) => [0, -d.heading || 0, 90],
                onClick,
                onHover: (info) => setHoverInfo(info),
            });
    
    
    const layer3D = new Tile3DLayer({
        id: "tile-3d-layer",
        // tileset json file url
        data: "https://assets.cesium.com/43978/tileset.json",
        loader: CesiumIonLoader,
        // https://cesium.com/docs/rest-api/
        loadOptions: {
            "cesium-ion": { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNzRjZjM2Zi1lYWRmLTRkZmYtYWMxZS1iYjUxN2E5NjYzNDQiLCJpZCI6MTc5MjQwLCJpYXQiOjE3MDAzMTYyMzh9.LGlQymatO0qSO1dVv1z-Xktr8CWZLd-CpQM9-KXqfRo" },
        },
        onTilesetLoad: (tileset) => {
            // Recenter to cover the tileset
            const { cartographicCenter, zoom } = tileset;
            this.setState({
                viewState: {
                    ...this.state.viewState,
                    longitude: cartographicCenter[0],
                    latitude: cartographicCenter[1],
                    zoom,
                },
            });
        },
        // override scenegraph subLayer prop
        _subLayerProps: {
            scenegraph: { _lighting: "flat" },
        },
    });
    
    
    return (
        <DeckGL
            layers={[flightPathLayer, trafficLayer, layer3D]}
            initialViewState={INITIAL_VIEW_STATE}
            controller
            getToolTip={getTooltip}
        >
            {hoverInfo?.object && (
                <div style={{
                    position: "absolute",
                    zIndex: 1,
                    pointerEvents: "none",
                    left: hoverInfo.x + 10,
                    top: hoverInfo.y + 10,
                    color: "green",
                }}
                >
                    <div className="grid grid-cols-2">
                        <div>
                            {hoverInfo.object?.callsign}
                        </div>
                        <div>{hoverInfo.object.flight_plan.aircraft_faa || hoverInfo.object.flight_plan.aircraft_short || "N/A"}</div>
                        <div>
                            {hoverInfo.object?.flight_plan.arrival || "N/A"}
                        </div>
                        <div>
                            {hoverInfo.object?.flight_plan.departure || "N/A"}
                        </div>
                        <div>
                            {hoverInfo.object?.groundspeed} kts
                        </div>
                        <div>
                            {hoverInfo.object?.altitude} feet
                        </div>
                    </div>
                </div>
            )}
            <Map reuseMaps mapLib={maplibregl} mapStyle={mapStyle} preventStyleDiffing />
        </DeckGL>
    );
}

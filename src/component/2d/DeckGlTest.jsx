/* eslint-disable no-mixed-operators,prefer-destructuring,react/no-this-in-sfc,react/destructuring-assignment */
import React, { useEffect, useRef, useState } from "react";
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
import { MapboxLayer } from "@deck.gl/mapbox";
import mapboxgl from "mapbox-gl";


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

const MAP_STYLE = "mapbox://styles/mason-zh/clqq37e4c00k801p586732u2h";
const ACCESS_TOKEN = "pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA";

function getTooltip({ object }) {
    console.log("pickale", object);
    return (
        object && `${object.callsign}`
    );
}

function DeckGlTest({ sizeScale = 25, onDataLoad, mapStyle = MAP_STYLE }) {
    const [mapboxMap, setMapboxMap] = useState(null); // New state for Mapbox map
    
    const [data, setData] = useState(null);
    const [trackData, setTrackData] = useState(null);
    const [selectTraffic, setSelectTraffic] = useState(null);
    const [hoverInfo, setHoverInfo] = useState(null);
    const mapRef = useRef(null);
    const deckRef = useRef(null);
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE); // DeckGL view state
    
    const formatTrack = [];
    
    const onViewStateChange = ({ viewState }) => {
        setViewState(viewState);
        if (mapboxMap) {
            mapboxMap.jumpTo({
                center: [viewState.longitude, viewState.latitude],
                zoom: viewState.zoom,
                bearing: viewState.bearing,
                pitch: viewState.pitch,
            });
        }
    };
    
    
    useEffect(() => {
        if (mapRef.current && !mapboxMap) {
            const map = new mapboxgl.Map({
                container: mapRef.current,
                style: MAP_STYLE,
                accessToken: ACCESS_TOKEN,
                center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
                zoom: INITIAL_VIEW_STATE.zoom,
                pitch: INITIAL_VIEW_STATE.pitch,
                bearing: INITIAL_VIEW_STATE.bearing,
            });
            
            map.on("load", () => {
                if (deckRef.current) {
                    map.addLayer(new MapboxLayer({ id: "deck", deck: deckRef.current }));
                }
            });
            
            map.on("moveend", () => {
                setViewState({
                    longitude: map.getCenter().lng,
                    latitude: map.getCenter().lat,
                    zoom: map.getZoom(),
                    pitch: map.getPitch(),
                    bearing: map.getBearing(),
                });
            });
            
            return () => map && map.remove();
        }
    }, [mapRef, mapboxMap]);
    
    
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
    
    
    return (
        <div style={{ height: "100vh" }}>
            <div ref={mapRef} style={{ height: "100%" }} />
            <DeckGL
                ref={deckRef}
                layers={[flightPathLayer, trafficLayer]}
                viewState={viewState}
                controller
                onViewStateChange={onViewStateChange}
                getTooltip={getTooltip}
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
                            <div>{hoverInfo.object.flight_plan?.aircraft_faa || hoverInfo.object.flight_plan?.aircraft_short || "N/A"}</div>
                            <div>
                                {hoverInfo.object.flight_plan?.arrival || "N/A"}
                            </div>
                            <div>
                                {hoverInfo.object?.flight_plan?.departure || "N/A"}
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
                {/* <Map reuseMaps mapLib={maplibregl} mapStyle={mapStyle} preventStyleDiffing /> */}
            </DeckGL>
            
        </div>
    );
}

export default DeckGlTest;

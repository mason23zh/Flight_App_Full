import React, {
    useEffect, useState, useCallback,
} from "react";
import DeckGL from "@deck.gl/react";
import mapboxgl from "mapbox-gl";

import {
    Map, Source,
} from "react-map-gl";
import {
    LineLayer
} from "@deck.gl/layers";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import axios from "axios";
import { COORDINATE_SYSTEM, FlyToInterpolator } from "@deck.gl/core";
import SelectedTrafficDetail from "./SelectedTrafficDetail";

// mapboxgl.accessToken = "pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA";
mapboxgl.accessToken = "pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA";

const DATA_URL = "https://data.vatsim.net/v3/vatsim-data.json";
const MODEL_URL = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scenegraph-layer/airplane.glb";
const ANIMATIONS = {
    "*": { speed: 1 },
};


function DeckGlTest2() {
    const [data, setData] = useState(null);
    const [trackData, setTrackData] = useState(null);
    const [selectTraffic, setSelectTraffic] = useState(null);
    const [hoverInfo, setHoverInfo] = useState(null);
    const [viewState, setViewState] = React.useState({
        longitude: -122.41669,
        latitude: 37.7853,
        zoom: 6,
        pitch: 0,
        bearing: 0,
    });

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


    const onClick = (info) => {
        setSelectTraffic(info.object);
    };

    const flightPathLayer = new LineLayer({
        id: "flight-path",
        data: formatTrack,

        /* props from LineLayer class */

        getColor: () => [255, 140, 0],
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
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
        highlightColor: [0, 0, 128, 128],
        modelMatrix: null,
        opacity: 1,
        pickable: false,
        visible: true,
        wrapLongitude: true,
    });


    const trafficLayer = data
            && new ScenegraphLayer({
                id: "traffics-layer",
                data,
                pickable: true,
                sizeScale: 25,
                scenegraph: MODEL_URL,
                _animations: ANIMATIONS,
                sizeMinPixels: 0.4,
                sizeMaxPixels: 0.5,
                getPosition: (d) => [
                    d.longitude || 0,
                    d.latitude || 0,
                    d.altitude = d.groundspeed < 50 ? 0 : d.altitude,
                ],
                getOrientation: (d) => [0, -d.heading || 0, 90],
                onClick,
                onHover: (info) => setHoverInfo(info),
            });


    if (trackData) {
        trackData.track.map(async (t, idx) => {
            // console.log("track data", t);
            const tempObj = {
                from: { coordinates: [] },
                to: { coordinates: [] }
            };
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


    const layers = [
        flightPathLayer,
        trafficLayer,
    ];


    const onMove = React.useCallback(({ viewState }) => {
        //const newCenter = [viewState.longitude, viewState.latitude];
        // map.setCenter(newCenter);
        setViewState({
            longitude: viewState.longitude,
            latitude: viewState, ...viewState
        });
        // Only update the view state if the center is inside the geofence
    }, []);

    const goToNYC = useCallback(() => {
        console.log("CLICK");
        setViewState({
            longitude: -74.1,
            latitude: 40.7,
            zoom: 14,
            pitch: 0,
            bearing: 0,
        });
    }, []);


    return (
        <div>
            <DeckGL
                initialViewState={viewState}
                controller
                layers={layers}
                onViewStateChange={({ viewState }) => setViewState(viewState)}
                // views={new GlobeView({ id: "globe", controller: true })}
                style={{
                    height: "100vh",
                    width: "100vw",
                    position: "relative"
                }}
                pickingRadius={10}
            >
                <Map
                    mapboxAccessToken="pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA"
                    initialViewState={viewState}
                    style={{
                        width: 600,
                        height: 400
                    }}
                    mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                    onMove={onMove}
                    // projection="globe"
                    terrain={{
                        source: "mapbox-dem",
                        exaggeration: 1.5
                    }}
                    dragPan={false}
                >
                    <Source
                        id="mapbox-dem"
                        type="raster-dem"
                        url="mapbox://mapbox.mapbox-terrain-dem-v1"
                        tileSize={512}
                        maxzoom={14}
                    />
                    <div className="bg-amber-600 px-2 py-3 z-1 absolute top-0 left-0 m-[12px] rounded-md">
                        Longitude: {viewState.longitude} | Latitude: {viewState.longitude} | Zoom: {viewState.zoom}
                    </div>
                    <div className="bg-amber-600 px-2 py-3 z-1 absolute top-10 left-0 m-[12px] rounded-md">
                        {(hoverInfo && hoverInfo.object) ? hoverInfo.object.callsign : ""}
                    </div>
                    {selectTraffic && <SelectedTrafficDetail traffic={selectTraffic}/>}
                </Map>
                <div className="bg-amber-600 px-2 py-3 z-1 absolute top-20 left-0 m-[12px] rounded-md">
                    <button onClick={goToNYC}>NEW YORK</button>
                </div>
                <div className="bg-amber-600 px-2 py-3 z-1 absolute top-30 left-0 m-[12px] rounded-md">
                    Total Traffic: {data && data.length}
                </div>
            </DeckGL>
        </div>
    );
}

export default DeckGlTest2;

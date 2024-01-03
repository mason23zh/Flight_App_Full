import React, { useState, useCallback } from "react";
import DeckGL from "@deck.gl/react/typed";
import { VatsimFlight } from "../../types";
import { Layer, Map, Source, } from "react-map-gl";
import SelectedTrafficDetail from "./SelectedTrafficDetail";
import flightPathLayer from "./layers/flightPathLayer";
import trafficLayer from "./layers/trafficLayer";
import useFetchVatsimPilots from "../../hooks/useFetchVatsimPilots";
import useFetchTrafficTrackData from "../../hooks/useFetchTrafficTrackData";


function DeckGlTest2() {

    const [selectTraffic, setSelectTraffic] = useState<Partial<VatsimFlight>>(null);
    const [hoverInfo, setHoverInfo] = useState<Partial<VatsimFlight>>(null);
    const [viewState, setViewState] = React.useState({
        longitude: -122.41669,
        latitude: 37.7853,
        zoom: 6,
        pitch: 0,
        bearing: 0,
    });

    const {
        data: vatsimData,
        error: vatsimError
    } = useFetchVatsimPilots();
    const {
        data: trackData,
        error: trackError
    } = useFetchTrafficTrackData(selectTraffic);

    const handleClick = (info: Partial<VatsimFlight>) => {
        setSelectTraffic(info);
    };
    const handleHover = (info: Partial<VatsimFlight>) => {
        setHoverInfo(info);
    };


    const layers = [
        flightPathLayer(trackData, selectTraffic, vatsimData),
        trafficLayer(vatsimData, handleClick, handleHover)
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
                onClick={(event) => console.log("CLICK", event)}
                initialViewState={viewState}
                controller
                layers={layers}
                onViewStateChange={() => setViewState(viewState)}
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
                    mapStyle="mapbox://styles/mason-zh/clqq37e4c00k801p586732u2h"
                    onMove={onMove}
                    // projection="globe"
                    terrain={{
                        source: "mapbox-dem",
                        exaggeration: 1.5
                    }}
                    dragPan={false}

                >
                    {/* <Source */}
                    {/*     id="mapbox-dem" */}
                    {/*     type="raster-dem" */}
                    {/*     url="mapbox://mapbox.mapbox-terrain-dem-v1" */}
                    {/*     tileSize={512} */}
                    {/*     maxzoom={14} */}
                    {/* /> */}
                    <Source
                        id="gns-430-source"
                        url="mapbox://mason-zh.clqwtv3cf6uko1mmpi3uooj4y-6emjw"
                        type="vector"
                        maxzoom={14}
                    >

                        <Layer
                            type="circle"
                            source="gns-430-source"
                            source-layer="gns_airport"
                            id="big-gns-430-airport-layer"
                            filter={["==", "type", "large_airport"]}
                            paint={{
                                "circle-color": "#00FF00",
                                "circle-radius": 3
                            }}
                        />

                        <Layer
                            type="circle"
                            source="gns-430-source"
                            source-layer="gns_airport"
                            id="medium-gns-430-airport-layer"
                            filter={["==", "type", "medium_airport"]}
                            minzoom={5.5}
                            paint={{
                                "circle-color": "#00FF00",
                                "circle-radius": 3
                            }}
                        />

                        <Layer
                            type="circle"
                            source="gns-430-source"
                            source-layer="gns_airport"
                            id="small-gns-430-airport-layer"
                            filter={["==", "type", "small_airport"]}
                            minzoom={7}
                            paint={{
                                "circle-color": "#00FF00",
                                "circle-radius": 3
                            }}
                        />

                        {/* <Layer */}
                        {/*     id="gns-430-airport-labels" */}
                        {/*     type="symbol" */}
                        {/*     source="gns-430-source" */}
                        {/*     source-layer="gns_airport" */}
                        {/*     layout={{ */}
                        {/*         "text-field": ["get", "ICAO"], */}
                        {/*         "text-variable-anchor": ["top", "bottom", "left", "right"], */}
                        {/*         "text-radial-offset": 0.5, */}
                        {/*         "text-justify": "auto", */}
                        {/*     }} */}
                        {/*     paint={{ */}
                        {/*         "text-color": "#000000", */}
                        {/*         "text-halo-color": "#ffffff", */}
                        {/*         "text-halo-width": 0.5, */}
                        {/*     }} */}
                        {/* /> */}

                    </Source>
                    <div className="bg-amber-600 px-2 py-3 z-1 absolute top-0 left-0 m-[12px] rounded-md">
                        Longitude: {viewState.longitude} | Latitude: {viewState.longitude} | Zoom: {viewState.zoom}
                    </div>
                    <div className="bg-amber-600 px-2 py-3 z-1 absolute top-10 left-0 m-[12px] rounded-md">
                        {(hoverInfo && Object.keys(hoverInfo).length !== 0) ? hoverInfo.callsign : ""}
                    </div>
                    {selectTraffic && <SelectedTrafficDetail traffic={selectTraffic}/>}
                </Map>
                <div className="bg-amber-600 px-2 py-3 z-1 absolute top-20 left-0 m-[12px] rounded-md">
                    <button onClick={goToNYC}>NEW YORK</button>
                </div>
                <div className="bg-amber-600 px-2 py-3 z-1 absolute top-30 left-0 m-[12px] rounded-md">
                    Total Traffic: {vatsimData && vatsimData.length}
                </div>
            </DeckGL>
        </div>
    );
}

export default DeckGlTest2;

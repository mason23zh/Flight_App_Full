import React, { useState, useCallback } from "react";
import DeckGL from "@deck.gl/react/typed";
import { VatsimFlight } from "../../types";
import { Map } from "react-map-gl";
import SelectedTrafficDetail from "./SelectedTrafficDetail";
import flightPathLayer from "./deckGL_Layer/flightPathLayer";
import trafficLayer from "./deckGL_Layer/trafficLayer";
import useFetchVatsimPilots from "../../hooks/useFetchVatsimPilots";
import useFetchTrafficTrackData from "../../hooks/useFetchTrafficTrackData";
import MapboxSourceLayer from "./mapbox_Layer/MapboxSourceLayer";
import SmallAirportLayer from "./mapbox_Layer/SmallAirportLayer";
import MediumAirportLayer from "./mapbox_Layer/MediumAirportLayer";
import LargeAirportLayer from "./mapbox_Layer/LargeAirportLayer";
import { PickingInfo } from "@deck.gl/core/typed";


function DeckGlTest2() {

    const [trackLayerVisible, setTrackLayerVisible] = useState<boolean>(false);
    const [trafficLayerVisible, setTrafficLayerVisible] = useState<boolean>(true);
    const [selectTraffic, setSelectTraffic] = useState<VatsimFlight | null>(null);
    const [hoverInfo, setHoverInfo] = useState<VatsimFlight | null>(null);
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

    const handleClick = (info: VatsimFlight) => {
        setSelectTraffic(info);
    };
    const handleHover = (info: VatsimFlight) => {
        setHoverInfo(info);
    };

    const layers = [
        flightPathLayer(trackData, selectTraffic, vatsimData, trackLayerVisible),
        trafficLayer(vatsimData, handleClick, handleHover, trafficLayerVisible)
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

    const deckOnLick = (event: PickingInfo) => {
        console.log("click event:", event);
        if (!event.layer) {
            setSelectTraffic(null);
            setTrackLayerVisible(false);
        } else if (event.layer && event.layer.id === "traffics-layer") {
            setTrackLayerVisible(true);
        }
    };


    return (
        <div>
            <DeckGL
                onClick={(event) => deckOnLick(event)}
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

                    <MapboxSourceLayer>
                        <SmallAirportLayer/>
                        <MediumAirportLayer/>
                        <LargeAirportLayer/>
                    </MapboxSourceLayer>


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


                    <div className="bg-amber-600 px-2 py-3 z-1 absolute top-0 left-0 m-[12px] rounded-md">
                        Longitude: {viewState.longitude} | Latitude: {viewState.longitude} | Zoom: {viewState.zoom}
                    </div>
                    <div className="bg-amber-600 px-2 py-3 z-1 absolute top-10 left-0 m-[12px] rounded-md">
                        {(hoverInfo && hoverInfo) ? hoverInfo.callsign : ""}
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

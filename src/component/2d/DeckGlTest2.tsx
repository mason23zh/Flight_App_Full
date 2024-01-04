import React, { useState, useCallback, useMemo } from "react";
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

interface PickedTraffic extends PickingInfo {
    object?: VatsimFlight | null;
}

//mapboxAccessToken="pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA"
//mapStyle="mapbox://styles/mason-zh/clqq37e4c00k801p586732u2h"
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


    const onMove = useCallback(({ viewState }) => {
        //const newCenter = [viewState.longitude, viewState.latitude];
        // map.setCenter(newCenter);
        setViewState({
            longitude: viewState.longitude,
            latitude: viewState, ...viewState
        });
        // Only update the view state if the center is inside the geofence
    }, []);


    const goToNYC = useCallback(() => {
        setViewState({
            longitude: -74.1,
            latitude: 40.7,
            zoom: 14,
            pitch: 0,
            bearing: 0,
        });
    }, []);

    const deckOnClick = useCallback((info: PickedTraffic, event) => {
        console.log("deck picking info:", info.object);
        console.log("deck picking event:", event);
        if (!selectTraffic || (info.layer && info.object && info.object.callsign !== selectTraffic.callsign)) {
            setSelectTraffic(info.object);
            setTrackLayerVisible(true);
        } else if (!info.layer) {
            setSelectTraffic(null);
            setTrackLayerVisible(false);
        }
    }, [selectTraffic]);

    const deckOnHover = useCallback((info: PickedTraffic) => {
        if (info.object && info.layer) {
            setHoverInfo(info.object);
        } else {
            setHoverInfo(null);
        }
    }, [hoverInfo]);


    const layers = [
        //flightPathLayer(trackData, selectTraffic, vatsimData, trackLayerVisible),
        useMemo(() =>
            flightPathLayer(trackData, selectTraffic, vatsimData, trackLayerVisible),
        [trackData, selectTraffic, vatsimData, trackLayerVisible]
        ),
        trafficLayer(vatsimData, trafficLayerVisible)
    ];

    const detailTrafficSection = useCallback(() => {
        if (selectTraffic) {
            return <SelectedTrafficDetail traffic={selectTraffic}/>;
        }
        return null;
    }, [selectTraffic]);

    return (
        <div>
            <DeckGL
                onClick={(info: PickedTraffic, event) => deckOnClick(info, event)}
                onHover={(info: PickedTraffic) => deckOnHover(info)}
                initialViewState={viewState}
                controller
                layers={layers}
                onViewStateChange={() => setViewState(viewState)}
                // views={new GlobeView({
                //     id: "globe",
                //     controller: true
                // })}
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
                    mapStyle="mapbox://styles/mason-zh/clqxdtuh100of01qrcwtw8en1"
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

                    <div className="bg-amber-600 px-2 py-3 z-1 absolute top-0 left-0 m-[12px] rounded-md">
                        Longitude: {viewState.longitude} | Latitude: {viewState.longitude} | Zoom: {viewState.zoom}
                    </div>
                    <div className="bg-amber-600 px-2 py-3 z-1 absolute top-10 left-0 m-[12px] rounded-md">
                        {(hoverInfo && hoverInfo) ? hoverInfo.callsign : ""}
                    </div>
                </Map>
                <div className="bg-amber-600 px-2 py-3 z-1 absolute top-20 left-0 m-[12px] rounded-md">
                    <button onClick={goToNYC}>NEW YORK</button>
                </div>
                <div className="bg-amber-600 px-2 py-3 z-1 absolute top-30 left-0 m-[12px] rounded-md">
                    Total Traffic: {vatsimData && vatsimData.length}
                </div>
                {detailTrafficSection()}
            </DeckGL>
        </div>
    );
}

export default DeckGlTest2;

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
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
import LayerTogglePanel from "./LayerTogglePanel";
import switchMapLabels from "./switchMapLabels";
import switchSatelliteView from "./switchSatelliteView";
import FirLayer from "./mapbox_Layer/FirLayer";
import FirBoundarySourceLayer from "./mapbox_Layer/FirBoundarySourceLayer";
import useFetchControllerData from "../../hooks/useFetchControllerData";
import FirTextLayer from "./mapbox_Layer/FirTextLayer";
import MapboxTextSourceLayer from "./mapbox_Layer/MapboxTextSourceLayer";
import ControllerMarker from "./mapbox_Layer/ControllerMarker";
import "mapbox-gl/dist/mapbox-gl.css";
import switchControllerView from "./switchControllerView";
import { NavigationControl } from "react-map-gl";
import DeckGlOverlay from "./deckGL_Layer/DeckGLOverlay";
import { _GlobeView as GlobeView } from "@deck.gl/core";


interface PickedTraffic extends PickingInfo {
    object?: VatsimFlight | null;
}

//mapboxAccessToken="pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA"
//mapStyle="mapbox://styles/mason-zh/clqq37e4c00k801p586732u2h"
function VatsimMap() {
    const mapRef = useRef(null);
    // const [showMarker, setShowMarker] = useState<boolean>(true);
    const [controllerLayerVisible, setControllerLayerVisible] = useState<boolean>(true);
    const [trackLayerVisible, setTrackLayerVisible] = useState<boolean>(false);
    const [trafficLayerVisible, setTrafficLayerVisible] = useState<boolean>(true);
    const [mapLabelVisible, setMapLabelVisible] = useState<boolean>(true);
    const [satelliteLayerVisible, setSatelliteLayerVisible] = useState<boolean>(false);
    const [selectTraffic, setSelectTraffic] = useState<VatsimFlight | null>(null);
    const [viewState, setViewState] = React.useState({
        longitude: -29.858598,
        latitude: 36.15178,
        zoom: 2.7,
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
    const {
        data: controllerData,
        error: controllerError
    } = useFetchControllerData();


    useEffect(() => {
        switchMapLabels(mapRef, mapLabelVisible);
    }, [mapLabelVisible]);

    useEffect(() => {
        switchSatelliteView(mapRef, satelliteLayerVisible);
    }, [satelliteLayerVisible]);

    useEffect(() => {
        switchControllerView(mapRef, controllerLayerVisible);
    }, [controllerLayerVisible]);


    const onMove = useCallback(({ viewState }) => {
        setViewState({
            longitude: viewState.longitude,
            latitude: viewState,
            ...viewState
        });
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

    const deckOnClick = useCallback((info: PickedTraffic) => {
        if (!selectTraffic || (info.layer && info.object && info.object.callsign !== selectTraffic.callsign)) {
            setSelectTraffic(info.object);
            setTrackLayerVisible(true);
        } else if (!info.layer) {
            setSelectTraffic(null);
            setTrackLayerVisible(false);
        }
    }, [selectTraffic]);

    const detailTrafficSection = useCallback(() => {
        if (selectTraffic) {
            return <SelectedTrafficDetail traffic={selectTraffic}/>;
        }
        return null;
    }, [selectTraffic]);

    const firLayers = useMemo(() => {
        return <FirLayer controllerInfo={controllerData}/>;
    }, [controllerData]);

    const firTextLayers = useMemo(() => {
        return <FirTextLayer controllerInfo={controllerData}/>;
    }, [controllerData]);

    // const onHoverTraffic = useMemo(() => {
    //     console.log(hoverInfo);
    //     if (hoverInfo.object) {
    //         return `${hoverInfo.object.callsign}
    //         ${hoverInfo.object.flight_plan.departure} - ${hoverInfo.object.flight_plan.arrival}
    //     `;
    //     }
    //
    // }, [hoverInfo]);

    const layers = [
        useMemo(() =>
            flightPathLayer(trackData, selectTraffic, vatsimData, trackLayerVisible),
        [trackData, selectTraffic, vatsimData, trackLayerVisible]
        ),
        trafficLayer(vatsimData, trafficLayerVisible)
    ];


    return (
        <div onContextMenu={evt => evt.preventDefault()}>
            <Map
                projection={{ name: "mercator" }}
                id="mainMap"
                ref={mapRef}
                mapboxAccessToken="pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA"
                mapStyle="mapbox://styles/mason-zh/clqxdtuh100of01qrcwtw8en1"
                initialViewState={viewState}
                style={{
                    height: "100vh",
                    width: "100vw",
                    position: "relative"
                }}
                onMove={onMove}
                dragPan={true}
            >
                {/*Navigation Control Icons*/}
                <NavigationControl/>

                {/*Vatsim ATC Controller Icons*/}
                {controllerLayerVisible &&
                    <ControllerMarker controllerInfo={controllerData}/>
                }

                {/*Render different number of airports based on map's zoom level*/}
                <MapboxSourceLayer>
                    <SmallAirportLayer/>
                    <MediumAirportLayer/>
                    <LargeAirportLayer/>
                </MapboxSourceLayer>

                {/*Vatsim CTR Control FIR zone*/}
                <FirBoundarySourceLayer>
                    {firLayers}
                </FirBoundarySourceLayer>

                {/*Vatsim CTR Control FIR Code*/}
                <MapboxTextSourceLayer>
                    {firTextLayers}
                </MapboxTextSourceLayer>

                {/*Vatsim Traffic and Traffic's path will be render using DeckGL*/}
                <DeckGlOverlay
                    // views={new GlobeView({
                    //     id: "globe",
                    //     controller: true
                    // })}
                    interleaved={true}
                    onClick={(info: PickedTraffic) => deckOnClick(info)}
                    layers={layers}
                    pickingRadius={10}

                    getTooltip={({ object }) => {
                        if (object) {
                            const bgColor = "rgba(39, 40, 45, 0.13)";
                            return {
                                text: object && `${object.callsign}
                                      ${object?.flight_plan?.departure} - ${object?.flight_plan?.arrival}`,
                                style: {
                                    backgroundColor: bgColor,
                                    color: "white"
                                }
                            };
                        }
                    }}
                />


                <div className="bg-amber-600 px-2 py-3 z-1 absolute top-20 left-0 m-[12px] rounded-md">
                    <button onClick={goToNYC}>NEW YORK</button>
                </div>
                <div className="bg-amber-600 px-2 py-3 z-1 absolute top-30 left-0 m-[12px] rounded-md">
                    Total Traffic: {vatsimData && vatsimData.length}
                </div>
                <div className="bg-amber-600 px-2 py-3 z-1 absolute bottom-50 right-[50%] m-[12px] rounded-md">
                    TEST ONLY
                </div>
                <div className="bg-amber-600 px-2 py-3 z-1 absolute bottom-40 right-[50%] m-[12px] rounded-md">
                    lat:{viewState.latitude}
                    lon:{viewState.longitude}
                    zoom:{viewState.zoom}
                </div>


                {detailTrafficSection()}

                {/*Map symbol switch panel*/}
                <LayerTogglePanel
                    onChangeTraffic={(e: boolean) => {
                        setTrafficLayerVisible(e);
                        setTrackLayerVisible(e);
                    }}
                    onChangeLabel={(e: boolean) => {
                        setMapLabelVisible(e);
                    }}
                    onChangeSatellite={(e: boolean) => {
                        setSatelliteLayerVisible(e);
                    }}
                    onChangeController={(e: boolean) => {
                        setControllerLayerVisible(e);
                    }}
                />
            </Map>

        </div>
    );
}

export default VatsimMap;

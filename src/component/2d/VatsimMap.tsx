import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { VatsimFlight } from "../../types";
import { Map, MapLayerMouseEvent } from "react-map-gl";
import SelectedTrafficDetail from "./SelectedTrafficDetail";
import flightPathLayer from "./deckGL_Layer/flightPathLayer";
import trafficLayer from "./deckGL_Layer/trafficLayer";
import useFetchVatsimPilots from "../../hooks/useFetchVatsimPilots";
import useFetchTrafficTrackData from "../../hooks/useFetchTrafficTrackData";
import { PickingInfo } from "@deck.gl/core/typed";
import LayerTogglePanel from "./LayerTogglePanel";
import switchMapLabels from "./switchMapLabels";
import switchSatelliteView from "./switchSatelliteView";
import useFetchControllerData from "../../hooks/useFetchControllerData";
import ControllerMarker from "./mapbox_Layer/ControllerMarker";
import "mapbox-gl/dist/mapbox-gl.css";
import switchControllerView from "./switchControllerView";
import { NavigationControl } from "react-map-gl";
import DeckGlOverlay from "./deckGL_Layer/DeckGLOverlay";
import { _GlobeView as GlobeView } from "@deck.gl/core";
import useFirLayers from "../../hooks/useFirLayers";
import useTraconLayers from "../../hooks/useTraconLayers";
import useAirportsLayers from "../../hooks/useAirportsLayers";
import FirNameMarkerLayer from "./mapbox_Layer/FIR_Layers/FirNameMarkerLayer";
import { debounce } from "lodash";
import TestFirLayer from "./mapbox_Layer/FIR_Layers/Test_FirLayer";
import TestTraconLayer from "./mapbox_Layer/Tracon_Layers/Test_TraconLayer";

interface PickedTraffic extends PickingInfo {
    object?: VatsimFlight | null;
}


function VatsimMap() {
    let isHovering = false; //when mouse is hovering on a layer, the pointer will change
    const mapRef = useRef(null);
    const [controllerLayerVisible, setControllerLayerVisible] = useState<boolean>(true);
    const [trackLayerVisible, setTrackLayerVisible] = useState<boolean>(false);
    const [trafficLayerVisible, setTrafficLayerVisible] = useState<boolean>(true);
    const [mapLabelVisible, setMapLabelVisible] = useState<boolean>(true);
    const [satelliteLayerVisible, setSatelliteLayerVisible] = useState<boolean>(false);
    const [selectTraffic, setSelectTraffic] = useState<VatsimFlight | null>(null);
    // const [hoverFir, setHoverFir] = useState(null);
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

    // const {
    //     firLayer: FirLayers,
    //     firTextLayer: FirTextLayer
    // } = useFirLayers(controllerData, controllerError, hoverFir);

    const {
        traconLayers: TraconLayers,
    } = useTraconLayers(controllerData, controllerError);

    const { airportLayers: AirportLayers } = useAirportsLayers();


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

    // const onMapLayerHover = useCallback((event: MapLayerMouseEvent) => {
    //     if (mapRef.current) {
    //         if (mapRef.current.getLayer("fir-text")) {
    //             const feature = mapRef.current.queryRenderedFeatures(event.point, { layers: ["fir-text"] });
    //             if (feature.length > 0) {
    //                 const newHoverFir = feature[0].properties.id;
    //                 if (newHoverFir !== hoverFir) {
    //                     console.log("set hover fir:", newHoverFir);
    //                     setHoverFir(newHoverFir);
    //                 }
    //             } else {
    //                 if (hoverFir !== null) {
    //                     setHoverFir(null);
    //                 }
    //             }
    //         }
    //     }
    // }, [mapRef, hoverFir, setHoverFir]);


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

    const controllerStatusIcons = useMemo(() => {
        if (controllerLayerVisible) {
            return <ControllerMarker controllerInfo={controllerData}/>;
        }

    }, [controllerData, controllerLayerVisible]);

    if (trackData) {
        console.log(trackError);
    }


    const layers = [
        useMemo(() => {
            if (!trackError) {
                return flightPathLayer(trackData, selectTraffic, vatsimData, trackLayerVisible);
            }
        },
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
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                mapStyle={import.meta.env.VITE_MAPBOX_MAIN_STYLE}
                initialViewState={viewState}
                style={{
                    height: "94vh",
                    width: "100vw",
                    position: "relative"
                }}
                onMove={onMove}
                //onMouseOver={onMapLayerHover}
                //onMouseMove={onMapLayerHover}
                dragPan={true}
                interactiveLayerIds={["firs"]}
            >

                <TestFirLayer controllerInfo={controllerData}/>
                <TestTraconLayer controllerInfo={controllerData}/>


                {/*Navigation Control Icons*/}
                <NavigationControl/>

                {/*Render different number of airports based on map's zoom level*/}
                {AirportLayers}

                {/*Vatsim ATC Controller Icons*/}
                {!controllerError && controllerStatusIcons}

                {/*Vatsim CTR Control FIR zone*/}
                {/* {FirLayers} */}

                {/*Vatsim CTR Control FIR Code*/}
                {/* {FirTextLayer} */}

                {/*Vatsim Tracon (Dep and App) boundaries*/}
                {/* {TraconLayers} */}

                {/*Vatsim Traffic and Traffic's path will be render using DeckGL*/}
                {!vatsimError &&
                    <DeckGlOverlay
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
                        onHover={({ object }) => (isHovering = Boolean(object))}
                        getCursor={({ isDragging }) => (isDragging ? "grabbing" : (isHovering ? "pointer" : "grab"))}
                    />
                }


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

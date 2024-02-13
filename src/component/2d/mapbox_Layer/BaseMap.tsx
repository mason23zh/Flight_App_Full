import React, { useCallback, useEffect, useRef } from "react";
import { Map, NavigationControl } from "react-map-gl";
import useAirportsLayers from "../../../hooks/useAirportsLayers";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import switchMapLabels from "../switchMapLabels";
import switchSatelliteView from "../switchSatelliteView";
import switchMapRoads from "../switchMapRoads";
import ToggleMapStyle from "../ToggleMapStyle";

const BaseMap = ({ children }) => {
    const mapRef = useRef(null);

    const {
        mapLabelVisible,
        satelliteLayerVisible,
        mapRoadVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const [viewState, setViewState] = React.useState({
        longitude: -29.858598,
        latitude: 36.15178,
        zoom: 2.7,
        pitch: 0,
        bearing: 0,
    });

    useEffect(() => {
        switchMapLabels(mapRef, mapLabelVisible);
    }, [mapLabelVisible]);

    useEffect(() => {
        switchSatelliteView(mapRef, satelliteLayerVisible);
    }, [satelliteLayerVisible]);

    useEffect(() => {
        switchMapRoads(mapRef, mapRoadVisible);
    }, [mapRoadVisible]);


    const { airportLayers: AirportLayers } = useAirportsLayers();

    const onMove = useCallback(({ viewState }) => {
        setViewState({
            longitude: viewState.longitude,
            latitude: viewState,
            ...viewState
        });
    }, []);
    // default projection: mercator
    return (
        <div onContextMenu={evt => evt.preventDefault()}>
            <Map
                projection={{ name: "mercator" }}
                id="mainMap"
                ref={mapRef}
                cursor={"pointer"}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                mapStyle={import.meta.env.VITE_MAPBOX_MAIN_STYLE}
                // mapboxAccessToken={"pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA"}
                // mapStyle={"mapbox://styles/mason-zh/clsfcpiw5038w01qs0iigh5tn"}
                initialViewState={viewState}
                style={{
                    height: "94vh",
                    width: "100vw",
                    position: "relative"
                }}
                onMove={onMove}
                dragPan={true}
            >
                <ToggleMapStyle mapRef={mapRef}/>
                <NavigationControl/>
                {AirportLayers}
                {children}
            </Map>
        </div>
    );
};

export default BaseMap;
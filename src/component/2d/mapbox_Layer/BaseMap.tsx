import React, { useCallback, useEffect, useRef } from "react";
import { Map, NavigationControl } from "react-map-gl";
import useAirportsLayers from "../../../hooks/useAirportsLayers";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import switchMapLabels from "../switchMapLabels";
import switchSatelliteView from "../switchSatelliteView";
import switchMapRoads from "../switchMapRoads";
import MapErrorMessageStack from "../map_error_loading/MapErrorMessageStack";


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
    // mercator
    return (
        <div onContextMenu={evt => evt.preventDefault()}>
            <Map
                projection={{ name: "mercator" }}
                id="mainMap"
                ref={mapRef}
                cursor={"pointer"}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                mapStyle={import.meta.env.VITE_MAPBOX_MAIN_STYLE}
                initialViewState={viewState}
                style={{
                    height: "94vh",
                    width: "100vw",
                    position: "relative"
                }}
                onMove={onMove}
                dragPan={true}
                interactiveLayerIds={["firs"]}
            >
                <NavigationControl/>
                {AirportLayers}
                {children}
            </Map>
        </div>
    );
};

export default BaseMap;
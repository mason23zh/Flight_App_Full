import React, { useCallback, useRef } from "react";
import { Map, NavigationControl } from "react-map-gl";
import useAirportsLayers from "../../../hooks/useAirportsLayers";


const BaseMap = ({ children }) => {
    const mapRef = useRef(null);
    const [viewState, setViewState] = React.useState({
        longitude: -29.858598,
        latitude: 36.15178,
        zoom: 2.7,
        pitch: 0,
        bearing: 0,
    });

    const { airportLayers: AirportLayers } = useAirportsLayers();

    const onMove = useCallback(({ viewState }) => {
        setViewState({
            longitude: viewState.longitude,
            latitude: viewState,
            ...viewState
        });
    }, []);

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
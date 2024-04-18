import React, { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { Map, NavigationControl } from "react-map-gl";
import useAirportsLayers from "../../../hooks/useAirportsLayers";
import TogglePanel from "../map_feature_toggle_button/TogglePanel";

const BaseMap = ({ children }) => {
    const mapRef = useRef(null);
    const [mapStyle, setMapStyle] = useState<CSSProperties>({
        height: "100%", // Default style
        width: "100%",
        position: "absolute"
    });

    const [viewState, setViewState] = useState({
        longitude: -29.858598,
        latitude: 36.15178,
        zoom: 2.7,
        pitch: 0,
        bearing: 0,
    });

    const { airportLayers: AirportLayers } = useAirportsLayers();

    useEffect(() => {
        const navbarHeight = document.querySelector(".main-navbar").clientHeight;
        const mapHeight = `calc(100vh - ${navbarHeight}px)`;
        setMapStyle(prevStyle => ({
            ...prevStyle,
            height: mapHeight
        }));
    }, []);

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
                dragRotate={false}
                pitchWithRotate={false}
                projection={{ name: "mercator" }}
                id="mainMap"
                ref={mapRef}
                cursor={"pointer"}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                mapStyle={import.meta.env.VITE_MAPBOX_MAIN_STYLE}
                initialViewState={viewState}
                style={mapStyle}
                onMove={onMove}
                dragPan={true}
            >
                <TogglePanel mapRef={mapRef}/>
                <NavigationControl position="bottom-left"/>
                {AirportLayers}
                {children}
            </Map>
        </div>
    );
};

export default BaseMap;
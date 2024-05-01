import React, { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { Map, NavigationControl, Source } from "react-map-gl";
import useAirportsLayers from "../../../hooks/useAirportsLayers";
import TogglePanel from "../map_feature_toggle_button/TogglePanel";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import DayNightLayer from "./DayNightTerminator_Layers/DayNightLayer";

const BaseMap = ({ children }) => {
    const mapRef = useRef(null);
    const { terrainEnable } = useSelector((state: RootState) => state.vatsimMapVisible);

    // Default view point
    const [viewState, setViewState] = useState({
        longitude: -29.858598,
        latitude: 36.15178,
        zoom: 2.7,
        pitch: 0,
        bearing: 0,
    });


    // This will ensure that the pitch and bearing is set to 0 when terrain is disabled
    useEffect(() => {
        if (!terrainEnable) {
            setViewState(currentState => ({
                ...currentState,
                pitch: 0,
                bearing: 0
            }));
        }
    }, [terrainEnable]);


    const [mapStyle, setMapStyle] = useState<CSSProperties>({
        height: "100%", // Default style
        width: "100%",
        position: "absolute"
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
                id="mainMap"
                ref={mapRef}
                projection={{ name: "mercator" }}
                cursor={"auto"}

                {...viewState} // to reset the pitch and bearing
                dragRotate={terrainEnable}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                mapStyle={import.meta.env.VITE_MAPBOX_MAIN_STYLE}
                initialViewState={viewState}
                maxPitch={70}
                style={mapStyle}
                onMove={onMove}
                dragPan={true}
                terrain={terrainEnable ? {
                    source: "mapbox-dem",
                    exaggeration: 1.5
                } : undefined}
            >
                {terrainEnable &&
                    <Source
                        id="mapbox-dem"
                        type="raster-dem"
                        url="mapbox://mapbox.mapbox-terrain-dem-v1"
                        tileSize={512}
                        maxzoom={14}
                    />
                }
                <TogglePanel mapRef={mapRef}/>
                <NavigationControl position="bottom-left"/>
                {AirportLayers}
                {children}
            </Map>
        </div>
    );
};

export default BaseMap;
import MapFeaturesToggleButton from "./MapFeaturesToggleButton";
import { useDispatch, useSelector } from "react-redux";
import {
    RootState,
    toggleAtcLayer,
    toggleMapFollowTraffic,
    toggleTelemetry,
    toggleTerrainLabel,
    toggleTrafficLayer,
    toggleWeatherRasterLayer,
} from "../../../store";
import { IoAirplane } from "react-icons/io5";
import { TiWeatherDownpour } from "react-icons/ti";
import { GiControlTower } from "react-icons/gi";
import { CgTerrain } from "react-icons/cg";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { IoSpeedometerOutline } from "react-icons/io5";
import MapStyleToggleButton from "./MapStyleToggleButton";
import MapFilterToggleButton from "./MapFilterToggleButton";
import useIsTouchScreen from "../../../hooks/useIsTouchScreen";
import { useWebSocketContext } from "../WebSocketContext";
import SearchButton from "./search_box/SearchButton";
import FeaturedAirportsButton from "./featured_airports/FeaturedAirportsButton";
import MapFeaturesToggleButton_v2 from "./MapFeaturesToggleButton_v2";

const TogglePanel = () => {
    // const { current: mapRef } = useMap();
    const {
        allAtcLayerVisible,
        trafficLayerVisible,
        weatherRasterVisible,
        terrainEnable,
        mapFollowTraffic,
        displayTelemetry,
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const { connectionStatus, liveTrafficAvailable } = useWebSocketContext();

    const dispatch = useDispatch();

    const parentStyle =
        "z-[200] absolute bottom-0 w-full sm:top-auto sm:left-0 " +
        "sm:bottom-auto sm:w-auto sm:right-auto";

    const childStyle =
        "flex flex-row items-center justify-center gap-2 p-1 bg-gray-700 " +
        "rounded-md sm:flex-col sm:items-start sm:ml-2 sm:mt-10 sm:justify-start";

    const isTouchScreen = useIsTouchScreen();

    return (
        <div className={parentStyle}>
            <div className="flex justify-center w-full sm:w-auto">
                <div className={childStyle}>
                    <SearchButton tooltipMessage="Search" isTouchScreen={isTouchScreen} />

                    <MapFeaturesToggleButton_v2
                        onToggle={() => dispatch(toggleTrafficLayer())}
                        icon={<IoAirplane />}
                        initialActive={trafficLayerVisible}
                        tooltipMessage="Toggle Vatsim traffic"
                        isTouchScreen={isTouchScreen}
                        buttonId="traffic-toggle-button"
                    />

                    <MapFeaturesToggleButton_v2
                        onToggle={() => dispatch(toggleAtcLayer())}
                        icon={<GiControlTower />}
                        initialActive={allAtcLayerVisible}
                        tooltipMessage="Toggle ATC visibility"
                        isTouchScreen={isTouchScreen}
                        buttonId="atc-toggle-button"
                    />

                    <MapFeaturesToggleButton_v2
                        onToggle={() => dispatch(toggleWeatherRasterLayer())}
                        icon={<TiWeatherDownpour />}
                        initialActive={weatherRasterVisible}
                        tooltipMessage="Toggle weather"
                        isTouchScreen={isTouchScreen}
                        buttonId="weather-toggle-button"
                    />

                    <MapFeaturesToggleButton_v2
                        onToggle={() => dispatch(toggleTerrainLabel())}
                        icon={<CgTerrain />}
                        initialActive={terrainEnable}
                        tooltipMessage="Toggle terrain and 3D view"
                        isTouchScreen={isTouchScreen}
                        buttonId="terrain-toggle-button"
                    />
                    {/* <LiveTrafficToggleButton */}
                    {/*     isTouchScreen={isTouchScreen} */}
                    {/* /> */}

                    {connectionStatus === "connected" && liveTrafficAvailable && (
                        <>
                            <MapFeaturesToggleButton_v2
                                onToggle={() => dispatch(toggleMapFollowTraffic())}
                                icon={<FaLocationCrosshairs />}
                                initialActive={mapFollowTraffic}
                                tooltipMessage="Map follow traffic"
                                isTouchScreen={isTouchScreen}
                                buttonId="moving-map-traffic-follow-button"
                            />

                            <MapFeaturesToggleButton
                                onToggle={(activeFlag) => dispatch(toggleTelemetry(activeFlag))}
                                icon={<IoSpeedometerOutline />}
                                initialActive={displayTelemetry}
                                tooltipMessage="Toggle traffic telemtry"
                                isTouchScreen={isTouchScreen}
                                buttonId="moving-map-telemetry-button"
                            />
                        </>
                    )}

                    <MapStyleToggleButton isTouchScreen={isTouchScreen} />

                    <MapFilterToggleButton isTouchScreen={isTouchScreen} />

                    <FeaturedAirportsButton
                        isTouchScreen={isTouchScreen}
                        tooltipMessage="Featured Airports"
                    />
                </div>
            </div>
        </div>
    );
};

export default TogglePanel;

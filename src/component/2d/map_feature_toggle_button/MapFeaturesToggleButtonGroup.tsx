import React, { useEffect } from "react";
import { MapRef } from "react-map-gl";
import switchMapLabels from "../switchMapLabels";
import switchMapRoads from "../switchMapRoads";
import { Toggle } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import {
    RootState,
    toggleDayNightTerminator,
    toggleMapLabel,
    toggleAirportLabel,
    toggleMapRoadLabel,
    toggleUnderlineFirBoundaries,
    toggleAirportVisible,
    resetMap
} from "../../../store";

interface Props {
    mapRef: React.RefObject<MapRef>;
    isTouchScreen: boolean;
}

type Tag = "LABEL" |
        "AIRPORT" |
        "AIRPORT_LABEL" |
        "ROAD" |
        "BUILDING" |
        "FIR" |
        "DAY_NIGHT_TERMINATOR";

const MapFeaturesToggleButtonGroup = ({
    mapRef,
    isTouchScreen
}: Props) => {
    const dispatch = useDispatch();
    const {
        mapLabelVisible,
        airportVisible,
        airportLabelVisible,
        mapRoadVisible,
        underlineFirBoundaries,
        dayNightTerminator,

    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const setMapFeatures = (mapRef: React.RefObject<MapRef>, flag: boolean, tag: Tag) => {
        if (mapRef.current) {
            switch (tag) {
            case "LABEL":
                switchMapLabels(mapRef, flag);
                break;
            case "ROAD":
                switchMapRoads(mapRef, flag);
                break;
            }
        }
    };

    useEffect(() => {
        const mapInstance = mapRef.current?.getMap();

        if (!mapInstance) return;

        const applyVisibilitySettings = () => {
            const currentMap = mapRef.current?.getMap();
            if (currentMap) {
                setMapFeatures(mapRef, mapLabelVisible, "LABEL");
                setMapFeatures(mapRef, mapRoadVisible, "ROAD");
            }
        };

        // listening the styledata event to apply current map settings
        // if map style changes, hence this useEffect function does not
        // require mapStyle as one of the dependencies.
        mapInstance.on("styledata", applyVisibilitySettings);

        //only change map settings without changing the map style
        if (mapInstance && mapInstance.isStyleLoaded()) {
            setMapFeatures(mapRef, mapLabelVisible, "LABEL");
            setMapFeatures(mapRef, mapRoadVisible, "ROAD");
        }

        // Cleanup
        return () => {
            mapInstance.off("styledata", applyVisibilitySettings);
        };
    }, [mapRef, mapLabelVisible, mapRoadVisible]);


    const handleOnChange = (mapFeature: Tag, checked: boolean) => {
        switch (mapFeature) {
        case "AIRPORT":
            dispatch(toggleAirportVisible(checked));
            break;
        case "AIRPORT_LABEL":
            dispatch(toggleAirportLabel(checked));
            break;
        case "LABEL":
            dispatch(toggleMapLabel(checked));
            break;
        case "ROAD":
            dispatch(toggleMapRoadLabel(checked));
            break;
        case "FIR":
            dispatch(toggleUnderlineFirBoundaries(checked));
            break;
        case "DAY_NIGHT_TERMINATOR":
            dispatch(toggleDayNightTerminator(checked));
            break;
        }
    };

    const resetButtonClass = isTouchScreen ?
        "bg-red-500 text-xs rounded-md px-2 py-1" :
        "bg-red-500 text-xs rounded-md px-2 py-1 hover:bg-red-400";


    return (
        <div className="min-w-[230px] sm:min-w-[280px] bg-gray-500 rounded-lg p-1">
            <div className="text-center font-bold text-white text-md sm:text-lg p-2">
                Map Feature Toggle
            </div>
            <div className="container grid-cols-1 gap-1 w-full font-bold text-xs sm:text-sm text-white">
                <div className="flex justify-between p-1 ml-2 mr-2 border-t">
                    <div>Airport</div>
                    <Toggle
                        checked={airportVisible}
                        onChange={(checked) => handleOnChange("AIRPORT", checked)}
                    />
                </div>
                <div className="flex justify-between p-1 ml-2 mr-2 border-t">
                    <div>Airport Label</div>
                    <Toggle
                        disabled={!airportVisible}
                        checked={airportLabelVisible}
                        onChange={(checked) => handleOnChange("AIRPORT_LABEL", checked)}
                    />
                </div>
                <div className="flex justify-between p-1 ml-2 mr-2 border-b border-t">
                    <div>Map Label</div>
                    <Toggle
                        checked={mapLabelVisible}
                        onChange={(checked) => handleOnChange("LABEL", checked)}/>
                </div>
                <div className="flex justify-between p-1 ml-2 mr-2 border-b">
                    <div>Road</div>
                    <Toggle
                        checked={mapRoadVisible}
                        onChange={(checked) => handleOnChange("ROAD", checked)}
                    />
                </div>
                <div className="flex justify-between p-1 ml-2 mr-2 border-b">
                    <div>Fir Boundaries</div>
                    <Toggle
                        checked={underlineFirBoundaries}
                        onChange={(checked) => handleOnChange("FIR", checked)}
                    />
                </div>
                <div className="flex justify-between p-1 ml-2 mr-2 border-b">
                    <div>Day Night Terminator</div>
                    <Toggle
                        checked={dayNightTerminator}
                        onChange={(checked) => handleOnChange("DAY_NIGHT_TERMINATOR", checked)}
                    />
                </div>
                <div className="flex items-center justify-center p-2 ml-2 mr-2">
                    <button
                        className={resetButtonClass}
                        onClick={() => {
                            dispatch(resetMap());
                        }}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapFeaturesToggleButtonGroup;
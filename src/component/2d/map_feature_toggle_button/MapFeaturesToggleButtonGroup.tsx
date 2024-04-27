import React, { useEffect } from "react";
import { MapRef } from "react-map-gl";
import switchMapLabels from "../switchMapLabels";
import switchMapRoads from "../switchMapRoads";
import { Toggle } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleMapLabel, toggleMapRoadLabel, toggleUnderlineFirBoundaries } from "../../../store";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

type Tag = "LABEL" | "ROAD" | "BUILDING" | "FIR";

const MapFeaturesToggleButtonGroup = ({
    mapRef
}: Props) => {
    const dispatch = useDispatch();
    const {
        mapLabelVisible,
        mapRoadVisible,
        underlineFirBoundaries,
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
        case "LABEL":
            dispatch(toggleMapLabel(checked));
            break;
        case "ROAD":
            dispatch(toggleMapRoadLabel(checked));
            break;
        case "FIR":
            dispatch(toggleUnderlineFirBoundaries(checked));
        }
    };

    return (
        <div className="min-w-[280px] bg-gray-500 rounded-lg p-1">
            <div className="text-center font-bold text-white text-lg p-2">
                Map Feature Toggle
            </div>
            <div className="container grid-cols-1 gap-1 w-full font-bold text-sm text-white">
                <div className="flex justify-between p-1 ml-2 mr-2 border-b border-t">
                    <div>Label</div>
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
                <div className="flex justify-between p-1 ml-2 mr-2">
                    <div>Fir Boundaries</div>
                    <Toggle
                        checked={underlineFirBoundaries}
                        onChange={(checked) => handleOnChange("FIR", checked)}
                    />
                </div>
            </div>
        </div>
    );
};

export default MapFeaturesToggleButtonGroup;
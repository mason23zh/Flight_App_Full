import React, { useEffect } from "react";
import { MapRef } from "react-map-gl";
import switchMapLabels from "../switchMapLabels";
import switchMapRoads from "../switchMapRoads";
import { Toggle } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleMapLabel, toggleMapRoadLabel } from "../../../store";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

type Tag = "LABEL" | "ROAD" | "BUILDING";
const MapFeaturesToggleButtonGroup = ({
    mapRef
}: Props) => {
    const {
        mapLabelVisible,
        mapRoadVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    const dispatch = useDispatch();

    const preloadedState = localStorage.getItem("persist:mapSelection") ?
        JSON.parse(localStorage.getItem("persist:mapSelection")) : undefined;

    console.log("Preload state:", preloadedState);

    useEffect(() => {
        const map = mapRef.current?.getMap();

        if (!map) return;

        const reapplyFeatureSettings = () => {
            setMapFeatures(mapRef, mapLabelVisible, "LABEL");
            setMapFeatures(mapRef, mapRoadVisible, "ROAD");
        };

        map.on("style.load", () => {
            reapplyFeatureSettings();
        });

        return () => {
            map.off("style.load", () => {
                reapplyFeatureSettings();
            });
        };
    }, [mapRef, mapLabelVisible, mapRoadVisible]);

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

    const handleOnChange = (mapFeature: Tag, checked: boolean) => {
        switch (mapFeature) {
        case "LABEL":
            dispatch(toggleMapLabel(checked));
            setMapFeatures(mapRef, checked, "LABEL");
            break;
        case "ROAD":
            dispatch(toggleMapRoadLabel(checked));
            setMapFeatures(mapRef, checked, "ROAD");
            break;
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
                <div className="flex justify-between p-1 ml-2 mr-2">
                    <div>Road</div>
                    <Toggle
                        checked={mapRoadVisible}
                        onChange={(checked) => handleOnChange("ROAD", checked)}
                    />
                </div>
            </div>
        </div>
    );
};

export default MapFeaturesToggleButtonGroup;
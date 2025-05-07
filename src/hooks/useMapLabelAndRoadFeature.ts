import { useMap } from "react-map-gl";
import { useEffect } from "react";
import switchMapLabels from "../component/map/switchMapLabels";
import switchMapRoads from "../component/map/switchMapRoads";

type MapStyle = "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE";

interface Props {
    mapLabelVisible: boolean;
    mapRoadVisible: boolean;
    mapStyles: MapStyle
}

const useMapLabelAndRoadFeature = ({
    mapLabelVisible,
    mapRoadVisible,
    mapStyles
}: Props) => {
    const { current: mapRef } = useMap();

    useEffect(() => {
        const map = mapRef?.getMap();
        if (!map) {
            console.log("map not available");
            return;
        }

        switchMapLabels(map, mapLabelVisible);
        switchMapRoads(map, mapRoadVisible);

        const reapply = () => {
            console.log("reapply run");
            switchMapLabels(map, mapLabelVisible);
            switchMapRoads(map, mapRoadVisible);
        };

        map.on("style.load", () => {
            reapply();
        });

        map.once("styledata", () => {
            console.log("style.load run");
            const waiting = () => {
                if (!map.isStyleLoaded()) {
                    setTimeout(waiting, 200);
                } else {
                    reapply();
                }
            };
            waiting();
        });

        return () => {
            map.off("style.load", reapply);
        };

    }, [mapRef, mapLabelVisible, mapRoadVisible, mapStyles]);
};

export default useMapLabelAndRoadFeature;
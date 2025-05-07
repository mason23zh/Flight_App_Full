import { useMap } from "react-map-gl";
import { useEffect } from "react";
import switchMapLabels from "../component/map/switchMapLabels";
import switchMapRoads from "../component/map/switchMapRoads";

interface Props {
    mapLabelVisible: boolean;
    mapRoadVisible: boolean;
}

const useMapLabelAndRoadFeature = ({
    mapLabelVisible,
    mapRoadVisible
}: Props) => {
    const { current: mapRef } = useMap();

    useEffect(() => {
        const map = mapRef?.getMap();
        if (!map) {
            return;
        }

        switchMapLabels(map, mapLabelVisible);
        switchMapRoads(map, mapRoadVisible);

        const reapply = () => {
            switchMapLabels(map, mapLabelVisible);
            switchMapRoads(map, mapRoadVisible);
        };

        mapRef.on("style.load", () => reapply());

        return () => {
            mapRef.off("style.load", reapply);
        };

    }, [mapRef, mapLabelVisible, mapRoadVisible]);
};

export default useMapLabelAndRoadFeature;
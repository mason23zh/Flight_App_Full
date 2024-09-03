import { VatsimFlight } from "../../../types";
import { useSelector } from "react-redux";
import { RootState, useFetchVatsimPilotsDataQuery } from "../../../store";
import { useMemo } from "react";
import trafficLayer_3D from "./trafficLayer_3D";

//TODO: Move aircraft layer into this component
interface AircraftLayerComponentProps {
    vatsimPilots: VatsimFlight[];
    terrainEnable: boolean;
    trafficLayerVisible: boolean;
    searchResultsVisible: boolean;

}

const AircraftLayerComponent = ({
    selectTraffic,
    setSelectTraffic
}: {
    selectTraffic: VatsimFlight | null;
    setSelectTraffic: (flight: VatsimFlight | null) => void;
}) => {
    const {
        terrainEnable,
        trafficLayerVisible,
        movingMap
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    const { searchResultsVisible } = useSelector((state: RootState) => state.mapDisplayPanel);
    const {
        data: vatsimPilots,
        error: vatsimPilotsError,
        isLoading: vatsimPilotsLoading
    } = useFetchVatsimPilotsDataQuery(undefined, { pollingInterval: 25000 });

    const filteredTrafficData = useMemo(() => {
        // Your traffic filtering logic here
    }, [vatsimPilots]);

    const trafficLayer3D = useMemo(() => {
        if (terrainEnable && trafficLayerVisible) {
            return trafficLayer_3D(filteredTrafficData, true);
        }
        return null;
    }, [terrainEnable, trafficLayerVisible, filteredTrafficData.length]);

    const trafficLayer2D = useMemo(() => {
        return trafficLayer_2D(vatsimPilots, !terrainEnable && trafficLayerVisible);
    }, [terrainEnable, vatsimPilots.length, trafficLayerVisible]);

    const localTrafficLayer = useMemo(() => {
        return renderLocalTrackFlightLayer(vatsimPilots, movingMap, terrainEnable);
    }, [movingMap, vatsimPilots, terrainEnable]);

    const trackLayer = useMemo(() => {
        if (searchResultsVisible) {
            setSelectTraffic(null);
        }
        // Logic to render track layer
    }, [searchResultsVisible]);

    return [trafficLayer3D, trafficLayer2D, localTrafficLayer, trackLayer].filter(Boolean);
};
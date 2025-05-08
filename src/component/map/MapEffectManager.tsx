/**
 * A center place to manage map's effect that applied for both Globe and Mercator projection
 * **/
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import useMapStyleSync from "../../hooks/useMapStyleSync";
import useMapTerrain from "../../hooks/useMapTerrain";
import useMapLabelAndRoadFeature from "../../hooks/useMapLabelAndRoadFeature";

const MapEffectManager = () => {
    const {
        mapStyles,
        mapRoadVisible,
        mapLabelVisible,
        terrainEnable
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    // useMapStyleSync(mapStyles);
    // useMapTerrain(terrainEnable);
    useMapLabelAndRoadFeature({
        mapLabelVisible,
        mapRoadVisible,
        mapStyles
    });

    return null;
};

export default MapEffectManager;
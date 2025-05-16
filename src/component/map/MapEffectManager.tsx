/**
 * A center place to manage map's effect that applied for both Globe and Mercator projection
 * **/
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import useMapLabelAndRoadFeature from "../../hooks/useMapLabelAndRoadFeature";

const MapEffectManager = () => {
    const { mapStyles, mapRoadVisible, mapLabelVisible } = useSelector(
        (state: RootState) => state.vatsimMapVisible
    );

    useMapLabelAndRoadFeature({
        mapLabelVisible,
        mapRoadVisible,
        mapStyles,
    });

    return null;
};

export default MapEffectManager;

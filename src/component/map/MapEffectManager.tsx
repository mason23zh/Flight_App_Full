/**
 * A center place to manage map's effect that applied for both Globe and Mercator projection
 * **/
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import useMapStyleSync from "../../hooks/useMapStyleSync";
import useMapTerrain from "../../hooks/useMapTerrain";

const MapEffectManager = () => {
    const { mapStyles } = useSelector((state: RootState) => state.vatsimMapVisible);

    useMapStyleSync(mapStyles);
    useMapTerrain();

    return null;
};

export default MapEffectManager;
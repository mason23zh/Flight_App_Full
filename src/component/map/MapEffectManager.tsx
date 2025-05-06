/**
 * A center place to manage map's effect that applied for both Globe and Mercator projection
 * **/
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import useMapStyleSync from "../../hooks/useMapStyleSync";

const MapEffectManager = () => {
    const { mapStyles } = useSelector((state: RootState) => state.vatsimMapVisible);

    useMapStyleSync(mapStyles);

    return null;
};

export default MapEffectManager;
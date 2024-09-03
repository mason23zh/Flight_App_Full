import { AirportService, VatsimControllers } from "../../../types";
import { HoverTracon } from "../mapbox_Layer/Tracon_Layers/TraconLabelPopup";
import { MatchedFir } from "../../../hooks/useMatchedFirs";
import { debounce } from "lodash";
import { FallbackTracon, MatchedTracon } from "../../../hooks/useMatchTracon";
import controllerIconLayer from "./controllerIconLayer";
import firIconLayer from "./firIconLayer";
import traconIconLayer from "./traconIconLayer";

interface AtcLayerComponentProps {
    atcLayerVisible: boolean;
    matchedFirs: MatchedFir[];
    matchedFallbackTracons: FallbackTracon[];
    matchedTracons: MatchedTracon[];
    controllerData: VatsimControllers;
    setHoverControllerIcon: (icon: AirportService | null) => void;
    setHoverTraconIcon: (icon: HoverTracon | null) => void;
    setHoverFirIcon: (icon: MatchedFir | null) => void;
}

const getAtcLayers = ({
    atcLayerVisible,
    controllerData,
    matchedFirs,
    matchedTracons,
    matchedFallbackTracons,
    setHoverControllerIcon,
    setHoverTraconIcon,
    setHoverFirIcon
}: AtcLayerComponentProps) => {


    const debouncedSetHoverControllerIcon = debounce((icon) => setHoverControllerIcon(icon), 300);
    const debouncedSetMatchedHoverTraconIcon = debounce((icon) => setHoverTraconIcon(icon), 300);
    const debouncedSetHoverFirIcon = debounce((icon) => setHoverFirIcon(icon), 300);

    const controllerMarkerLayer =
            controllerIconLayer(controllerData, debouncedSetHoverControllerIcon, atcLayerVisible);

    const firLabelLayer =
            firIconLayer(matchedFirs, debouncedSetHoverFirIcon, atcLayerVisible);

    const traconLabelLayer =
            traconIconLayer(
                matchedTracons,
                matchedFallbackTracons,
                debouncedSetMatchedHoverTraconIcon,
                atcLayerVisible);

    return [controllerMarkerLayer, traconLabelLayer, firLabelLayer].filter(Boolean);
};

export default getAtcLayers;
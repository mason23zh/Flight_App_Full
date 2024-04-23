import { useControl } from "react-map-gl";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox/typed";

const DeckGLOverLay = (props: MapboxOverlayProps & {
    interleaved?: boolean;
}) => {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
};

export default DeckGLOverLay;
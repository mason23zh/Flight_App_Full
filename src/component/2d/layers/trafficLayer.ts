import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import { VatsimFlight } from "../../../types";

const MODEL_URL = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scenegraph-layer/airplane.glb";
const ANIMATIONS = {
    "*": { speed: 1 },
};
const trafficLayer = (data: VatsimFlight, onClick: () => void, setHoverInfo: (info: object) => void) => {
    return data && new ScenegraphLayer({
        id: "traffics-layer",
        data,
        pickable: true,
        sizeScale: 25,
        scenegraph: MODEL_URL,
        _animations: ANIMATIONS,
        sizeMinPixels: 0.4,
        sizeMaxPixels: 0.5,
        getPosition: (d) => [
            d.longitude || 0,
            d.latitude || 0,
            d.altitude = d.groundspeed < 50 ? 0 : d.altitude,
        ],
        getOrientation: (d) => [0, -d.heading || 0, 90],
        onClick,
        onHover: (info) => setHoverInfo(info),
    });
};

export default trafficLayer;
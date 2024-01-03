import { ScenegraphLayer } from "@deck.gl/mesh-layers/typed";
import { VatsimFlight } from "../../../types";


const MODEL_URL = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scenegraph-layer/airplane.glb";
const ANIMATIONS = {
    "*": { speed: 1 },
};

const trafficLayer = (
    data: Array<VatsimFlight>,
    handleClick: (info: VatsimFlight) => void,
    handleHover: (info: VatsimFlight) => void,
    visible: boolean) => {


    return data && new ScenegraphLayer({
        id: "traffics-layer",
        data,
        pickable: true,
        sizeScale: 25,
        scenegraph: MODEL_URL,
        _animations: ANIMATIONS,
        sizeMinPixels: 0.4,
        sizeMaxPixels: 0.5,
        visible: visible,
        getColor: () => [228, 235, 10],
        getPosition: (d) => [
            d.longitude || 0,
            d.latitude || 0,
            d.altitude = d.groundspeed < 50 ? 0 : d.altitude,
        ],
        getOrientation: (d) => [0, -d.heading || 0, 90],
        onClick: (info) => (info && info.object) ? handleClick(info.object) : handleClick(null),
        onHover: (info) => (info && info.object) ? handleHover(info.object) : handleHover(null)
    });
};

export default trafficLayer;
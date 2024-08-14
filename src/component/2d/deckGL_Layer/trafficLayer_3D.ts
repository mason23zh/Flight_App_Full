/*
* Using ScenegraphLayer to render all vatsim traffic with 3D object
*/

import { ScenegraphLayer } from "@deck.gl/mesh-layers/typed";
import { VatsimFlight } from "../../../types";
import airplane_model from "../../../assets/models/airplane.glb";

const ANIMATIONS = {
    "*": { speed: 1 },
};

const trafficLayer_3D = (
    data: Array<VatsimFlight>,
    visible: boolean) => {

    if (!visible || !data) return null;

    return new ScenegraphLayer({
        id: "traffics-layer",
        data,
        pickable: true,
        sizeScale: 20,
        scenegraph: airplane_model,
        _animations: ANIMATIONS,
        sizeMinPixels: 0.3,
        sizeMaxPixels: 0.4,
        visible: visible,
        getColor: () => [228, 235, 10],
        getPosition: (d) => [
            d.longitude || 0,
            d.latitude || 0,
            d.groundspeed < 50 ? 0 : d.altitude,
        ],
        getOrientation: (d) => [0, -d.heading || 0, 90],
    });

};

export default trafficLayer_3D;
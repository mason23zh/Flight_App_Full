import { VatsimFlight } from "../types";
import airplane_model from "../assets/models/airplane.glb";
import { ScenegraphLayer, ScenegraphLayerProps } from "@deck.gl/mesh-layers/typed";
import { PickingInfo } from "@deck.gl/core/typed";

const ANIMATIONS: ScenegraphLayerProps["_animations"] = {
    "*": { speed: 1 }
};

const useTrafficLayer3D = (
    data: Array<VatsimFlight>,
    visible: boolean,
) => {
    if (!data || data.length === 0) return null;

    // console.log("use traffic layer 3d run.");

    const updateTriggers = {
        getPosition: data.map(d => `${d.longitude},${d.latitude}`)
            .join("-"),
        getOrientation: data.map(d => d.heading)
            .join("-"),
    };

    return new ScenegraphLayer({
        id: "traffic-layer-3d",
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
        updateTriggers,
    });
};

export default useTrafficLayer3D;
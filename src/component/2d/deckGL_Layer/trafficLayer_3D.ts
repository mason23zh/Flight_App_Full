/*
* Using ScenegraphLayer to render all vatsim traffic with 3D object
*/

import { ScenegraphLayer } from "@deck.gl/mesh-layers/typed";
import { load } from "@loaders.gl/core";
import { GLTFLoader } from "@loaders.gl/gltf";
import { VatsimFlight } from "../../../types";
import airport_model from "../../../assets/models/airplane.glb";
import { useEffect, useState } from "react";

const ANIMATIONS = {
    "*": { speed: 1 },
};

const trafficLayer_3D = (
    data: Array<VatsimFlight>,
    visible: boolean) => {
    const [airportModel, setAirplaneModel] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGLT = async () => {
            try {
                const airplane = await load(airport_model, GLTFLoader);
                if (airplane) {
                    setAirplaneModel(airplane);
                }
            } catch (e) {
                throw new Error("Error loading 3d file:", e);
            }
        };
        loadGLT()
            .then()
            .catch((e) => setError(e));
    }, []);


    return (data && !error) && new ScenegraphLayer({
        id: "traffics-layer",
        data,
        pickable: true,
        sizeScale: 20,
        scenegraph: airportModel && airportModel,
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
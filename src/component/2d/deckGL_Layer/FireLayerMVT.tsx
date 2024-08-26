import React, { useMemo } from "react";
import { MVTLayer } from "@deck.gl/geo-layers";
import { VatsimControllers } from "../../../types";
import useMatchedFirs from "../../../hooks/useMatchedFirs";

interface Controller {
    controllerInfo: VatsimControllers;
    labelVisible: boolean;
}

const FIRLayerMvt = ({
    controllerInfo,
    labelVisible = true
}: Controller) => {
    const tileURL = "https://api.mapbox.com/v4/mason-zh.cm00590z503li1tlkgyy8e5s3-5pv1b/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA";

    console.log("FIR MVT layer run.");

    const {
        matchedFirs,
        isLoading,
        isError
    } = useMatchedFirs(controllerInfo);

    const matchedFirsMapped = useMemo(() => {
        return matchedFirs.map(fir => ({
            id: fir.firInfo.firBoundary,
            oceanic: fir.firInfo?.entries[0]?.oceanic || "0"
        }));
    }, [matchedFirs]);

    const matchedFirConditions = useMemo(() => {
        return new Set(matchedFirsMapped.map(fir => `${fir.id}_${fir.oceanic}`));
    }, [matchedFirsMapped]);

    const renderedLayer = useMemo(() => {
        return new MVTLayer({
            id: "fir-boundaries-layer-mvt",
            data: [tileURL],
            // getLineColor: [0, 0, 0, 0],
            getFillColor: d => {
                const id = d.properties.id;
                const oceanic = d.properties.oceanic || "0";
                return matchedFirConditions.has(`${id}_${oceanic}`)
                    ? [148, 153, 168, 70]
                    : [255, 255, 255, 0];
            },
            getLineColor: [255, 255, 255, 255],
            getLineWidth: 1,
        });
    }, [matchedFirConditions]);

    if (isLoading || isError) return null;
    
    return renderedLayer;

    //
    // return new MVTLayer({
    //     id: "fir-boundaries-layer-mvt",
    //     data: [tileURL],
    //     // getLineColor: [0, 0, 0, 0],
    //     getFillColor: d => {
    //         const id = d.properties.id;
    //         const oceanic = d.properties.oceanic || "0";
    //         return matchedFirConditions.has(`${id}_${oceanic}`)
    //             ? [148, 153, 168, 70]
    //             : [255, 255, 255, 0];
    //     },
    //     getLineColor: [255, 255, 255, 255],
    //     getLineWidth: 1,
    //
    // });
};

export default FIRLayerMvt;
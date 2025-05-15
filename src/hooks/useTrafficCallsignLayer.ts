import { VatsimFlight } from "../types";
import { TextLayer } from "@deck.gl/layers/typed";
import { useMemo } from "react";

const useTrafficCallsignLayer = (data: Array<VatsimFlight>, visible: boolean) => {
    return useMemo(() => {
        return new TextLayer({
            id: "traffic-callsign-text",
            visible: visible,
            data: data,
            getPosition: (d: VatsimFlight) => [d.longitude || 0, d.latitude || 0, 0],
            getText: (d: VatsimFlight) => d?.callsign || "",
            getTextAnchor: "middle",
            getAlignmentBaseline: "center",
            getPixelOffset: [0, -25],
            getColor: [255, 128, 0],
            getSize: 15
        });
    }, [data, visible]);
};

export default useTrafficCallsignLayer;
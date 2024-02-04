import React, { useMemo } from "react";
import DeckGlOverlay from "./deckGL_Layer/DeckGLOverlay";
import flightPathLayer from "./deckGL_Layer/flightPathLayer";
import trafficLayer from "./deckGL_Layer/trafficLayer";
import { VatsimFlight } from "../../types";

interface MainTrafficLayerProps {
    vatsimPilots: Array<VatsimFlight>;
}

const MainTrafficLayer = ({ vatsimPilots }: MainTrafficLayerProps) => {
    console.log("Main traffic layer pilots", vatsimPilots);
    let isHovering = false;
    const layers = [
        // useMemo(() => {
        //     if (!trackError) {
        //         return flightPathLayer(trackData, selectTraffic, vatsimData, trackLayerVisible);
        //     }
        // },
        // [trackData, selectTraffic, vatsimData, trackLayerVisible]
        // ),
        trafficLayer(vatsimPilots, true)
    ];


    return (
        <DeckGlOverlay
            interleaved={true}
            //onClick={(info: PickedTraffic) => deckOnClick(info)}
            layers={layers}
            pickingRadius={10}

            getTooltip={({ object }) => {
                if (object) {
                    const bgColor = "rgba(39, 40, 45, 0.13)";
                    return {
                        text: object && `${object.callsign}
                                      ${object?.flight_plan?.departure} - ${object?.flight_plan?.arrival}`,
                        style: {
                            backgroundColor: bgColor,
                            color: "white"
                        }
                    };
                }
            }}
            onHover={({ object }) => (isHovering = Boolean(object))}
            getCursor={({ isDragging }) => (isDragging ? "pointer" : (isHovering ? "pointer" : "grab"))}
        />
    );
};

export default MainTrafficLayer;
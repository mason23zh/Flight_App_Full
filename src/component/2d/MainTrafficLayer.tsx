import React, { useCallback, useMemo, useState } from "react";
import DeckGlOverlay from "./deckGL_Layer/DeckGLOverlay";
import flightPathLayer from "./deckGL_Layer/flightPathLayer";
import trafficLayer from "./deckGL_Layer/trafficLayer";
import { VatsimFlight } from "../../types";
import { PickingInfo } from "@deck.gl/core/typed";
import { useFetchTrafficTrackDataQuery } from "../../store";

interface MainTrafficLayerProps {
    vatsimPilots: Array<VatsimFlight>;
}

interface PickedTraffic extends PickingInfo {
    object?: VatsimFlight | null;
}

const MainTrafficLayer = ({ vatsimPilots }: MainTrafficLayerProps) => {
    const [selectTraffic, setSelectTraffic] = useState<VatsimFlight | null>(null);

    const {
        data: trackData,
        error: trackError,
        isLoading: trackLoading
    } = useFetchTrafficTrackDataQuery(selectTraffic?.callsign ?? "", {
        skip: !selectTraffic
    });

    const trackLayer = useMemo(() => {
        if (trackData && !trackLoading && !trackError) {
            return flightPathLayer(trackData.data, selectTraffic, vatsimPilots, true);
        }
    }, [trackData, trackLoading, trackError, selectTraffic]);

    const deckOnClick = useCallback((info: PickedTraffic) => {
        if (!selectTraffic || (info.layer && info.object && info.object.callsign !== selectTraffic.callsign)) {
            setSelectTraffic(info.object);
        } else if (!info.layer) {
            setSelectTraffic(null);
        }
    }, [selectTraffic]);


    let isHovering = false;
    const layers = [
        trackLayer,
        trafficLayer(vatsimPilots, true)
    ];


    return (
        <DeckGlOverlay
            interleaved={true}
            onClick={(info: PickedTraffic) => deckOnClick(info)}
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
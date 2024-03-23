import React, { useCallback, useEffect, useMemo, useState } from "react";
import DeckGlOverlay from "./deckGL_Layer/DeckGLOverlay";
import flightPathLayer from "./deckGL_Layer/flightPathLayer";
import trafficLayer from "./deckGL_Layer/trafficLayer";
import { VatsimFlight } from "../../types";
import { PickingInfo } from "@deck.gl/core/typed";
import {
    addMessage,
    removeMessageByLocation,
    useFetchTrafficTrackDataQuery,
    setSelectedTraffic
} from "../../store";
import { useDispatch } from "react-redux";

interface MainTrafficLayerProps {
    vatsimPilots: Array<VatsimFlight>;
}

interface PickedTraffic extends PickingInfo {
    object?: VatsimFlight | null;
}

const MainTrafficLayer = ({ vatsimPilots }: MainTrafficLayerProps) => {

    const dispatch = useDispatch();

    const [selectTraffic, setSelectTraffic] = useState<VatsimFlight | null>(null);

    const {
        data: trackData,
        error: trackError,
        isLoading: trackLoading
    } = useFetchTrafficTrackDataQuery(selectTraffic?.callsign ?? "", {
        skip: !selectTraffic
    });

    useEffect(() => {
        if (trackError) {
            dispatch(addMessage({
                location: "TRAFFIC_TRACK",
                messageType: "ERROR",
                content: "Error loading track data for selected traffic."
            }));
        }
        if (trackData) {
            dispatch(removeMessageByLocation({ location: "TRAFFIC_TRACK" }));
        }
    }, [trackData, trackError, trackLoading]);

    const trackLayer = useMemo(() => {
        if (trackData && !trackLoading && !trackError) {
            return flightPathLayer(trackData.data, selectTraffic, vatsimPilots, true);
        }
    }, [trackData, trackLoading, trackError, selectTraffic]);

    const deckOnClick = useCallback((info: PickedTraffic) => {
        if (!selectTraffic || (info.layer && info.object && info.object.callsign !== selectTraffic.callsign)) {
            setSelectTraffic(info.object);
            dispatch(setSelectedTraffic(info.object));
            console.log("Selected traffic info:", info.object);
        } else if (!info.layer) {
            dispatch(setSelectedTraffic(null)); //dispatch null would close the FlightInfo Panel
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
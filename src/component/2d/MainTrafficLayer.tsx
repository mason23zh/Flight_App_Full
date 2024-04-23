/**
 * Use to render the DeckGL overlay
 * */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import DeckGlOverlay from "./deckGL_Layer/DeckGLOverlay";
import flightPathLayer from "./deckGL_Layer/flightPathLayer";
import trafficLayer_3D from "./deckGL_Layer/trafficLayer_3D";
import { VatsimFlight } from "../../types";
import { PickingInfo } from "@deck.gl/core/typed";
import {
    addMessage,
    removeMessageByLocation,
    useFetchTrafficTrackDataQuery,
    setSelectedTraffic, RootState
} from "../../store";
import { useDispatch, useSelector } from "react-redux";
import trafficLayer_2D from "./deckGL_Layer/trafficLayer_2D";

interface MainTrafficLayerProps {
    vatsimPilots: Array<VatsimFlight>;
}

interface PickedTraffic extends PickingInfo {
    object?: VatsimFlight | null;
}

const MainTrafficLayer = ({ vatsimPilots }: MainTrafficLayerProps) => {

    const dispatch = useDispatch();
    let isHovering = false;
    const [selectTraffic, setSelectTraffic] = useState<VatsimFlight | null>(null);
    const { terrainEnable } = useSelector((state: RootState) => state.vatsimMapVisible);


    const {
        data: trackData,
        error: trackError,
        isLoading: trackLoading
    } = useFetchTrafficTrackDataQuery(selectTraffic?.callsign ?? "", {
        skip: !selectTraffic
    });
    //
    const trafficLayer3D = trafficLayer_3D(vatsimPilots, terrainEnable);
    // const trafficLayer2D = trafficLayer_2D(vatsimPilots, !terrainEnable);

    // useMemo can ONLY with trafficLayer_2D
    const trafficLayer2D = useMemo(() => {
        return trafficLayer_2D(vatsimPilots, !terrainEnable);
    }, [terrainEnable, vatsimPilots]);
    // const trafficLayer3D = useMemo(() => {
    //     return trafficLayer_3D(vatsimPilots, terrainEnable);
    // }, [terrainEnable, vatsimPilots]);

    //
    // const trafficLayer3D = useMemo(() => {
    //     if (terrainEnable) {
    //         return trafficLayer_3D(vatsimPilots, true);
    //     }
    // }, [vatsimPilots, terrainEnable]);


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
        } else if (!info.layer) {
            dispatch(setSelectedTraffic(null)); //dispatch null would close the FlightInfo Panel
            setSelectTraffic(null);
        }
    }, [selectTraffic]);


    const layers = useMemo(() => [
        trackLayer, // Always included, assuming it's a defined layer or null if no data
        terrainEnable ? trafficLayer3D : trafficLayer2D
    ].filter(Boolean), [trackData, trafficLayer3D, trafficLayer2D, terrainEnable]);

    return (
        <DeckGlOverlay
            interleaved={true}
            onClick={(info: PickedTraffic) => deckOnClick(info)}
            // layers={terrainEnable ? [trackLayer, trafficLayer3D] : [trackLayer, trafficLayer2D]}
            layers={layers}
            pickingRadius={10}

            getTooltip={({ object }) => {
                if (object) {
                    const bgColor = "rgba(39, 40, 45, 0.13)";
                    return {
                        text: object && `${object.callsign}
                                      ${object?.flight_plan?.departure || "N/A"} - ${object?.flight_plan?.arrival || "N/A"}`,
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
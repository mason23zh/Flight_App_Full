// useDelayHoverLabel hook will return hover information and onHover/leave function
// single function handleMouse will handle both hover and leave cases.
import { useCallback, useEffect, useRef, useState } from "react";
import GeoJson from "geojson";
import { AirportService, AirportResponse } from "../types";
import { MatchedFir } from "./useMatchedFirs";
import { FallbackTracon, MatchedTracon } from "./useMatchTracon";

interface AirportResponseWithDepartureOriginType {
    type: "DEPARTURE" | "ARRIVAL";
    airportInfo: AirportResponse;
}

const useDelayHoverLabel = () => {
    const [hoverInfo, setHoverInfo] = useState<
        | GeoJson.FeatureCollection
        | AirportService
        | AirportResponseWithDepartureOriginType
        | MatchedFir
        | MatchedTracon
        | FallbackTracon
        | null
    >(null);
    const hoverDelayHandlerRef = useRef<NodeJS.Timeout | null>(null);

    const clearHoverTimeout = useCallback(() => {
        if (hoverDelayHandlerRef.current) {
            clearTimeout(hoverDelayHandlerRef.current);
            hoverDelayHandlerRef.current = null;
        }
    }, []);

    useEffect(() => {
        // cleanup
        return () => clearHoverTimeout();
    }, [clearHoverTimeout]);

    const handleMouse = useCallback(
        (
            info:
                | GeoJson.FeatureCollection
                | AirportService
                | AirportResponseWithDepartureOriginType
                | MatchedTracon
                | MatchedFir
                | FallbackTracon
                | null,
            entering: boolean,
            enterDelay: number,
            leaveDelay: number
        ) => {
            clearHoverTimeout();

            const delay = entering ? enterDelay : leaveDelay;
            hoverDelayHandlerRef.current = setTimeout(() => {
                setHoverInfo(info);
            }, delay);
        },
        [clearHoverTimeout]
    );

    return [hoverInfo, handleMouse] as const;
};

export default useDelayHoverLabel;

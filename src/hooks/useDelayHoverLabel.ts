// useDelayHoverLabel hook will return hover information and onHover/leave function
// single function handleMouse will handle both hover and leave cases.
import { useCallback, useEffect, useRef, useState } from "react";
import GeoJson from "geojson";
import { AirportService } from "../types";
// interface Service {
//     airport: { name: string, icao: string },
//     callsign: string,
//     cid: string,
//     coordinates: string[],
//     facility: number,
//     frequency: string,
//     last_updated: string,
//     logon_time: string,
//     name: string,
//     rating: number,
//     server: string,
//     serviceType: string,
//     text_atis: string[],
//     visual_range: number,
//     atis_code?: string,
// }
//
//
// interface AirportService {
//     airportName: string,
//     icao: string,
//     coordinates: string[],
//     services: Array<Service>
// }


//type Info = AirportService | GeoJson.Feature | GeoJson.FeatureCollection | null;

const useDelayHoverLabel = () => {
    const [hoverInfo, setHoverInfo] = useState<GeoJson.FeatureCollection | AirportService | null>(null);
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

    const handleMouse = useCallback((info: GeoJson.FeatureCollection | AirportService | null, entering: boolean, enterDelay: number, leaveDelay: number) => {
        clearHoverTimeout();

        const delay = entering ? enterDelay : leaveDelay;
        hoverDelayHandlerRef.current = setTimeout(() => {
            setHoverInfo(info);
        }, delay);
    }, [clearHoverTimeout]);

    return [hoverInfo, handleMouse] as const;
};

export default useDelayHoverLabel;
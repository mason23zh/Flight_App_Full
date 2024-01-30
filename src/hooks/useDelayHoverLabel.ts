import { useCallback, useEffect, useState } from "react";
import GeoJson from "geojson";

interface Service {
    airport: { name: string, icao: string },
    callsign: string,
    cid: string,
    coordinates: string[],
    facility: number,
    frequency: string,
    last_updated: string,
    logon_time: string,
    name: string,
    rating: number,
    server: string,
    serviceType: string,
    text_atis: string[],
    visual_range: number,
    atis_code?: string,
}


interface AirportService {
    airportName: string,
    icao: string,
    coordinates: string[],
    services: Array<Service>
}


type Info = AirportService | GeoJson.Feature | GeoJson.FeatureCollection | null;

const useDelayHoverLabel = () => {
    const [hoverInfo, setHoverInfo] = useState(null);
    const [hoverDelayHandler, setHoverDelayHandler] = useState(null);


    useEffect(() => {
        return () => {
            if (hoverDelayHandler) {
                clearTimeout(hoverDelayHandler);
            }
        };
    }, [hoverDelayHandler]);

    const handleMouse = useCallback((info: Info, entering: boolean, enterDelay: number, leaveDelay: number) => {
        if (hoverDelayHandler) {
            clearTimeout(hoverDelayHandler);
        }

        const handler = setTimeout(() => {
            setHoverInfo(entering ? info : null);
        }, entering ? enterDelay : leaveDelay);

        setHoverDelayHandler(handler);
    }, [hoverDelayHandler]);

    return [hoverInfo, handleMouse];

};

export default useDelayHoverLabel;
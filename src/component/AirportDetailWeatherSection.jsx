import React, { useEffect, useState } from "react";
import { useFetchMetarByICAOQuery } from "../store";

function AirportDetailWeatherSection({ icao }) {
    const [skipRender, setSkipRender] = useState(true);
    const [ICAO, setICAO] = useState("");
    useEffect(() => {
        if (icao) {
            setICAO(icao);
            setSkipRender(false);
        }
    }, [icao]);
    
    const { data: metar, error, isFetching } = useFetchMetarByICAOQuery({ icao: ICAO, decode: true }, {
        skip: skipRender,
        refetchOnMountOrArgChange: true,
    });
    
    
    if (error) {
        return (
            <div>
                Unable to fetch weather for ${icao.toUpperCase()}
            </div>
        );
    }
    
    if (isFetching) {
        return (
            <div>
                Fetching weather for ${icao.toUpperCase()}
            </div>
        );
    }
    
    if (metar) {
        if (metar.data && metar.results !== 0) {
            const { data } = metar;
            console.log(data);
        }
        return (
            <div>
                data
            </div>
        );
    }
}

export default AirportDetailWeatherSection;

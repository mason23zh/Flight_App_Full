import { useEffect, useState } from "react";
import axios from "axios";
import { VatsimFlight } from "../types";

interface VatsimTrafficResponse {
    data: { results: number, pilots: Array<VatsimFlight> };
}

const useFetchVatsimPilots = () => {
    //const DATA_URL = "https://data.vatsim.net/v3/vatsim-data.json";
    const DATA_URL = "https://api.airportweather.org/v1/vatsim/getpilots";
    const [data, setData] = useState<Array<VatsimFlight>>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTrafficData = async () => {
            try {
                const res = await axios.get<VatsimTrafficResponse>(DATA_URL);
                if (res) {
                    setData(res.data.data.pilots);
                }
            } catch (e) {
                throw new Error("Unable fetch Vatsim Traffic Data");
            }
        };
        getTrafficData()
            .then()
            .catch((e) => setError(e));
        const interval = setInterval(() => getTrafficData()
            .then()
            .catch(e => setError(e)), 20000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return {
        data,
        error
    };
};

export default useFetchVatsimPilots;
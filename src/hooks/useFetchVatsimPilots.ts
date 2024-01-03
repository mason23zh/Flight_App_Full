import { useEffect, useState } from "react";
import axios from "axios";
import { VatsimFlight } from "../types";

interface VatsimTrafficResponse {
    pilots: Array<VatsimFlight>;
}

const useFetchVatsimPilots = () => {
    const DATA_URL = "https://data.vatsim.net/v3/vatsim-data.json";
    const [data, setData] = useState<Array<VatsimFlight>>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTrafficData = async () => {
            try {
                const res = await axios.get<VatsimTrafficResponse>(DATA_URL);
                if (res) {
                    setData(res.data.pilots);
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
import { useEffect, useState } from "react";
import axios from "axios";
import { VatsimControllers } from "../types";

const useFetchControllerData = () => {
    const [data, setData] = useState<VatsimControllers>(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        const getControllerData = async () => {
            try {
                const res = await axios.get<VatsimControllers>("https://api.airportweather.org/v1/vatsim/getVatsimControllers");
                if (res) {
                    setData(res.data);
                }
            } catch (e) {
                throw new Error("Can not get controller data");
            }
        };

        getControllerData()
            .then()
            .catch((e) => setError(e));
    }, []);
    return {
        data,
        error
    };
};
export default useFetchControllerData;

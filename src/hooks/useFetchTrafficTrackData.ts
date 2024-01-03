import { useEffect, useState } from "react";
import axios from "axios";
import { VatsimFlight, VatsimTrackTraffic } from "../types";

interface VatsimTrackResponse {
    data: VatsimTrackTraffic;
}

const useFetchTrafficTrackData = (selectTraffic: Partial<VatsimFlight>) => {
    const [data, setData] = useState<VatsimTrackTraffic>(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        const getTrackData = async () => {
            if (selectTraffic && Object.keys(selectTraffic).length !== 0) {
                try {
                    const res = await axios.get<VatsimTrackResponse>(`https://api.airportweather.org/v1/vatsim/getTrafficByCallsign/track/${selectTraffic.callsign}`);
                    if (res) {
                        setData(res.data.data);
                    }
                } catch (e) {
                    throw new Error("Can not get track data");
                }
            } else {
                throw new Error("Can not get track data");
            }
        };
        getTrackData()
            .then()
            .catch((e) => setError(e));
    }, [selectTraffic]);

    return {
        error,
        data
    };
};

export default useFetchTrafficTrackData;
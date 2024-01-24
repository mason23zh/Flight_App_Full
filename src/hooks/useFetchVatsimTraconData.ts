import { useEffect, useState } from "react";
import GeoJson from "geojson";
import { VatsimFirs } from "../types";
import axios from "axios";

const useFetchVatsimTraconData = () => {
    const [traconGeoJsonBoundaries, setGeoJsonData] = useState<GeoJson.FeatureCollection>(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log("fetch request run");
            try {
                const geoJsonResponse = await axios.get("https://api.airportweather.org/v1/vatsim/data/vatsim-traconboundaries.json");
                //const firResponse = await axios.get("https://api.airportweather.org/v1/vatsim/data/vatsim-firs.json");
                if (geoJsonResponse.data) {
                    setGeoJsonData(geoJsonResponse.data);
                }
            } catch (e) {
                console.error("Error fetching fir boundaries data", e);
            }
        };

        fetchData()
            .then()
            .catch();
    }, []);

    return [traconGeoJsonBoundaries];
};

export default useFetchVatsimTraconData;
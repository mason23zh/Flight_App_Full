import { useEffect, useState } from "react";
import axios from "axios";
import { VatsimFirs } from "../types";
import GeoJson from "geojson";

const useFetchVatsimFirData = (): [VatsimFirs, GeoJson.FeatureCollection] => {
    const [geoJsonData, setGeoJsonData] = useState<GeoJson.FeatureCollection>(null);
    const [firData, setFirData] = useState<VatsimFirs>(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log("fetch request run");
            try {
                const geoJsonResponse = await axios.get("https://api.airportweather.org/v1/vatsim/data/vatsim-firboundaries.json");
                const firResponse = await axios.get("https://api.airportweather.org/v1/vatsim/data/vatsim-firs.json");
                if (geoJsonResponse.data) {
                    setGeoJsonData(geoJsonResponse.data);
                }
                if (firResponse.data) {
                    setFirData(firResponse.data);
                }
            } catch (e) {
                console.error("Error fetching fir boundaries data", e);
            }
        };

        fetchData()
            .then()
            .catch();
    }, []);

    return [firData, geoJsonData];
};

export default useFetchVatsimFirData;
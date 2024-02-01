import { useEffect, useState } from "react";
import axios from "axios";
import { VatsimFirs } from "../types";
import GeoJson from "geojson";
import { useFetchVatsimFirBoundariesQuery, useFetchVatsimFirQuery } from "../store";

const useFetchVatsimFirData = (): [VatsimFirs, GeoJson.FeatureCollection] => {
    const {
        data: firData,
        error: firError,
        isLoading: firLoading
    } = useFetchVatsimFirQuery({});

    const {
        data: geoJsonData,
        error: geoJsonError,
        isLoading: geoJsonLoading
    } = useFetchVatsimFirBoundariesQuery({});

    if (geoJsonLoading) {
        console.log("geo json loading:", geoJsonLoading);
    }
    return [firData, geoJsonData];
};


// const useFetchVatsimFirData = (): [VatsimFirs, GeoJson.FeatureCollection] => {
//     const [geoJsonData, setGeoJsonData] = useState<GeoJson.FeatureCollection>(null);
//     const [firData, setFirData] = useState<VatsimFirs>(null);
//
//     useEffect(() => {
//         const fetchData = async () => {
//             console.log("fetch request run");
//             try {
//                 const geoJsonResponse = await axios.get("https://api.airportweather.org/v1/vatsim/data/vatsim-firboundaries.json");
//                 const firResponse = await axios.get("https://api.airportweather.org/v1/vatsim/data/vatsim-firs.json");
//                 if (geoJsonResponse.data) {
//                     setGeoJsonData(geoJsonResponse.data);
//                 }
//                 if (firResponse.data) {
//                     setFirData(firResponse.data);
//                 }
//             } catch (e) {
//                 console.error("Error fetching fir boundaries data", e);
//             }
//         };
//
//         fetchData()
//             .then()
//             .catch();
//     }, []);
//
//     return [firData, geoJsonData];
// };

export default useFetchVatsimFirData;
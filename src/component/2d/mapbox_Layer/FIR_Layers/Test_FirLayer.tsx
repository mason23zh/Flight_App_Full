import React, { useEffect, useState } from "react";
import { VatsimControllers } from "../../../../types";
import axios from "axios";

interface Controller {
    controllerInfo: VatsimControllers;
}

const TestFirLayer = ({ controllerInfo }: Controller) => {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [firData, setFirData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const geoJsonResponse = await axios.get("https://api.airportweather.org/v1/vatsim/data/vatsim-firboundaries.json");
                const firResponse = await axios.get("https://api.airportweather.org/v1/vatsim/data/vatsim-firs.json");
                if (geoJsonResponse.data) {
                    setGeoJsonData(geoJsonResponse.data);
                }
                // console.log("Fir response", firResponse);
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

    if (geoJsonData && controllerInfo) {
        console.log("Controller Info:", controllerInfo.fir);
        console.log("GeoJson Data:", geoJsonData);
    }


    if (firData && controllerInfo) {
        const matchedFirs = [];
        controllerInfo.fir.forEach(controller => {
            const parts = controller.callsign.split("_"); // split controller's callsign by "_"
            if (parts[parts.length - 1] === "CTR") {  //If the end of callsign contains "CTR", remove "CTR"
                parts.pop();
            }
            let matchFound = false; //set default match state
            while (parts.length > 0 && !matchFound) {
                const potentialMatch = parts.join("_");
                if (firData[potentialMatch]) {
                    // match found
                    console.log("Matched controller:", controller.callsign);
                    console.log("Matched GeoJson Features:", firData[potentialMatch].fir);
                    matchedFirs.push(firData[potentialMatch]);
                    matchFound = true;
                }

                parts.pop(); // remove the last element in the callsign if no match
            }
        });

        if (matchedFirs.length !== 0) {
            matchedFirs.forEach((mFir) => {
                const geoJsonFeature = geoJsonData.features.find(features => features.properties.id === mFir.fir);
                if (geoJsonFeature) {
                    console.log("geo json id:", geoJsonFeature.properties.id);
                }
            });
        }

    }


    return (
        <div>

        </div>
    );
};

export default TestFirLayer;
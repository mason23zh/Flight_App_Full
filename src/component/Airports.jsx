import axios from "axios";
import { useState } from "react";
import backgroundImage from "../images/mika-baumeister-DHlZenOMjJI-unsplash.jpg";
import HeroSection from "./HeroSection";
import AirportsList from "./AirportsList";

const Airports = () => {
    const [fetchedData, setFetchedData] = useState([]);
    const message = "Airport information";
    const placeHolderMessage = "Search ICAO or airport name";

    const fetchData = async (userInput) => {
        const response = await axios.get(`http://localhost:8001/api/v1/airports/generic/${userInput}`);
        setFetchedData([]);
        const airports = response.data.data.map((airport) => {
            return airport;
        });
        setFetchedData(airports);
        console.log(airports);
        return response.data;
    };

    const handleOnSubmit = (input) => {
        fetchData(input).catch((e) => console.error(e));
    };

    return (
        <div>
            <HeroSection
                backgroundImage={backgroundImage}
                message={message}
                placedHoldMessage={placeHolderMessage}
                onSubmit={handleOnSubmit}
            />
            <AirportsList airports={fetchedData} />
        </div>
    );
};

export default Airports;

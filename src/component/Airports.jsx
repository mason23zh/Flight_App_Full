import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomProvider } from "rsuite";
import backgroundImage from "../images/mika-baumeister-DHlZenOMjJI-unsplash.jpg";
import HeroSection from "./HeroSection";
import AirportsList from "./AirportsList";
import { useFetchAirportsWithGenericInputQuery } from "../store";
import { useTheme } from "../hooks/ThemeContext";

function Airports() {
    const darkMode = useTheme();
    const navigate = useNavigate();
    const { pathname, state } = useLocation();
    const [userInput, setUserInput] = useState("");
    const [skipRender, setSkipRender] = useState(true);
    const [page, setPage] = useState(1);
    const [airportData, setAirportData] = useState();
    const message = "Airport information";
    const placeHolderMessage = "ICAO, IATA, Name, City ... ";
    
    
    // take input results from the Navbar and make the search
    useEffect(() => {
        if (pathname === "/airport" && state?.userInput) {
            setUserInput(state.userInput);
            setSkipRender(false);
        }
    }, [state?.userInput]);
    
    const {
        data,
        error,
        isFetching,
    } = useFetchAirportsWithGenericInputQuery({ searchTerm: userInput, page, limit: 10 }, {
        skip: skipRender,
        refetchOnMountOrArgChange: true,
    });
    
    useEffect(() => {
        if (data) {
            setAirportData(data);
        }
    }, [data]);
    
    if (airportData) {
        localStorage.setItem("airportListData", JSON.stringify(airportData));
    }
    
    
    const handleOnSubmit = (input) => {
        setUserInput(input);
        setSkipRender(false);
        setPage(1);
    };
    
    const onGoToPage = (inputPage) => {
        setPage(inputPage);
    };
    
    let renderedAirport;
    if (data) {
        // If only one result been returned, direct to airport detail page
        if (data.data.airports.length === 1) {
            // set localStorage for airport detail page
            localStorage.setItem("airportData", JSON.stringify(data.data.airports[0]));
            // set localStorage for airport list page
            localStorage.setItem("airportListData", JSON.stringify(data));
            const { ICAO } = data.data.airports[0];
            navigate(`/airport/detail/${ICAO}`);
        }
        renderedAirport = <AirportsList airports={data} goToPage={onGoToPage} />;
    } else if (isFetching) {
        renderedAirport = <div className="text-lg text-center">Loading...</div>;
    } else if (error) {
        renderedAirport = <div className="text-center"><h3>Error</h3></div>;
    } else if (localStorage.getItem("airportListData") !== null) {
        const localData = JSON.parse(localStorage.getItem("airportListData"));
        renderedAirport = <AirportsList airports={localData} goToPage={onGoToPage} />;
    } else {
        renderedAirport = <div className="text-center text-xl"><h3>Enter search query</h3></div>;
    }
    
    return (
        <div>
            <HeroSection
                backgroundImage={backgroundImage}
                message={message}
                placedHoldMessage={placeHolderMessage}
                onSubmit={handleOnSubmit}
            />
            {renderedAirport}
        </div>
    );
}

export default Airports;

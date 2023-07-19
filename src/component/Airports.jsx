import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import backgroundImage from "../images/mika-baumeister-DHlZenOMjJI-unsplash.jpg";
import HeroSection from "./HeroSection";
import AirportsList from "./AirportsList";
import { useFetchAirportsWithGenericInputQuery } from "../store";
import Skeleton from "./Skeleton";

function Airports() {
    const { pathname, state } = useLocation();
    const [userInput, setUserInput] = useState("");
    const [skipRender, setSkipRender] = useState(true);
    const [page, setPage] = useState(1);
    const message = "Airport information";
    const placeHolderMessage = "Search ICAO or airport name";
    
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
    
    
    const handleOnSubmit = (input) => {
        setUserInput(input);
        setSkipRender(false);
    };
    
    const onGoToPage = (inputPage) => {
        setPage(inputPage);
    };
    
    let renderedAirport;
    if (data) {
        renderedAirport = <AirportsList airports={data} goToPage={onGoToPage} />;
    } else if (isFetching) {
        renderedAirport = <Skeleton className="h-8 w-auto" times={10} />;
    } else if (error) {
        renderedAirport = <h3>Error</h3>;
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

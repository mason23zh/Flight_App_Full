import React from "react";
import { CustomProvider } from "rsuite";
import backgroundImage from "../images/pascal-meier-UYiesSO4FiM-unsplash.jpg";
import HomeHeroSection from "./HomeHeroSection";
import { useFetchMostPopularAirportsQuery } from "../store";
import HomeAirportList from "./HomeAirportList";
import { useTheme } from "../hooks/ThemeContext";

function Home() {
    const { data, error, isFetching } = useFetchMostPopularAirportsQuery();
    const darkMode = useTheme();
    const darkTheme = darkMode
        ? "flex p-5 text-center justify-center bg-gray-400"
        : "flex p-5 text-center justify-center bg-gray-200";
    
    let renderedAirport;
    if (data) {
        renderedAirport = <div><HomeAirportList airports={data} /></div>;
    } else if (isFetching) {
        renderedAirport = <div className="text-lg text-center">Loading...</div>;
    } else if (error) {
        renderedAirport = <h3>Error</h3>;
    }
    
    
    return (
        <div>
            <HomeHeroSection backgroundImage={backgroundImage} />
            <CustomProvider theme={darkMode ? "dark" : "light"}>
                <div className={darkTheme}>
                    <div className="text-2xl md:text-3xl">Popular Airports</div>
                </div>
                <div className="h-[80%] flex flex-col items-center">
                    {renderedAirport}
                </div>
            </CustomProvider>
            {/* <div className="text-red-600 bottom-0 fixed opacity-80"> */}
            {/*    DISCLAIMER: NOT FOR REAL NAVIGATION */}
            {/* </div> */}
        </div>
    );
}

export default Home;
 

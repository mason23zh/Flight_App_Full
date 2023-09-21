'use client'

import React, { useRef } from "react";
import { CustomProvider } from "rsuite";
import { useTheme } from "@/hooks/ThemeContext";
import { useFetchMostPopularAirportsQuery, useFetchVatsimPopularAirportsQuery } from "@/store";
import backgroundImage from "../../public/images/pascal-meier-UYiesSO4FiM-unsplash.jpg";

import HomeHeroSection from "@/components/Home/HomeHeroSection";
import HomeAirportList from "@/components/Home/HomeAirportList";
import HomeVatsimAirportsList from "@/components/Home/HomeVatsimAirportsList";
// import ScrollToHashElement from "@/components/Home/ScrollToHashElement";

function Home() {
    const { data, error, isFetching } = useFetchMostPopularAirportsQuery();
    
    const {
        data: vatsimAirports,
        error: vatsimAirportsError,
        isFetching: vatsimAirportsFetching,
    } = useFetchVatsimPopularAirportsQuery({ limit: 10 });
    const darkMode = useTheme();
    const darkTheme = darkMode
        ? "flex p-5 text-center justify-center bg-gray-400"
        : "flex p-5 text-center justify-center bg-gray-200";
    
    let renderedAirport;
    let renderVatsimAirports;
    if (data) {
        renderedAirport = <HomeAirportList airports={data} />;
    } else if (isFetching) {
        renderedAirport = <div className="text-lg text-center">Loading...</div>;
    } else if (error) {
        renderedAirport = <h3>Error</h3>;
    }
    
    
    if (vatsimAirports) {
        renderVatsimAirports = <HomeVatsimAirportsList airports={vatsimAirports} />;
    } else if (vatsimAirportsFetching) {
        renderedAirport = <div className="text-lg text-center">Loading...</div>;
    } else if (vatsimAirportsError) {
        renderedAirport = <h3 className="text-lg text-center">Error Loading Vatsim Traffic</h3>;
    }
    
    
    return (
        <div>
            {/* <ScrollToHashElement /> */}
            <HomeHeroSection
                backgroundImage={backgroundImage}
            />
                <div className={darkTheme}>
                    <div
                        className="text-2xl md:text-3xl"
                        id="popular-airports"
                    >
                        Popular Airports
                    </div>
                </div>
                <div>
                    {renderedAirport}
                </div>
                <div className={darkTheme}>
                    <div
                        className="text-2xl md:text-3xl"
                        id="popular-vatsim-airports"
                    >
                        Popular Vatsim Airports
                    </div>
                </div>
                <div>
                    {renderVatsimAirports}
                </div>
        </div>
    );
}

export default Home;
 

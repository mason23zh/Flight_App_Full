import React from "react";
import { CustomProvider } from "rsuite";
import backgroundImage from "../images/pascal-meier-UYiesSO4FiM-unsplash.jpg";
import HomeHeroSection from "./HomeHeroSection";
import { useFetchMostPopularAirportsQuery, useFetchVatsimPopularAirportsQuery } from "../store";
import HomeAirportList from "./HomeAirportList";
import { useTheme } from "../hooks/ThemeContext";
import HomeVatsimAirportsList from "./HomeVatsimAirportsList";

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
            <HomeHeroSection backgroundImage={backgroundImage} />
            <CustomProvider theme={darkMode ? "dark" : "light"}>
                <div className={darkTheme}>
                    <div className="text-2xl md:text-3xl">Popular Airports</div>
                </div>
                <div className="mb-3">
                    {renderedAirport}
                </div>
                <div className={darkTheme}>
                    <div className="text-2xl md:text-3xl">Popular Vatsim Airports</div>
                </div>
                <div className="">
                    {renderVatsimAirports}
                </div>
            </CustomProvider>
        </div>
    );
}

export default Home;
 

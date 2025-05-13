import { useEffect, useState } from "react";
import { CustomProvider } from "rsuite";
import backgroundImage from "../images/pascal-meier-UYiesSO4FiM-unsplash.jpg";
import HomeHeroSection from "./HomeHeroSection";
import {
    useFetchCurrentVatsimEventsQuery,
    useFetchMostPopularAirportsQuery,
    useFetchVatsimPopularAirportsQuery,
} from "../store";
import HomeAirportList from "./HomeAirportList";
import { useTheme } from "../hooks/ThemeContext";
import HomeVatsimAirportsList from "./HomeVatsimAirportsList";
import ScrollToHashElement from "./ScrollToHashElement";
import HomeVatsimEvents from "./HomeVatsimEvents";
import { Helmet } from "react-helmet-async";

//TODO: Style improve? use custom scroll bar?

function Home() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [vatsimEventsAvailable, setVatsimEventsAvailable] = useState(false);
    const {
        data,
        error,
        isFetching,
    } = useFetchMostPopularAirportsQuery();
    const {
        data: vatsimEvents,
        error: vatsimEventsError,
        isFetching: vatsimEventsFetching,
    } = useFetchCurrentVatsimEventsQuery();
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
    let renderVatsimEvents;
    if (data) {
        renderedAirport = <HomeAirportList airports={data} />;
    } else if (isFetching) {
        renderedAirport = <div className="text-lg text-center">Loading...</div>;
    } else if (error) {
        renderedAirport = <h3 className="text-lg text-center">Error loading Airports</h3>;
    }


    if (vatsimAirports) {
        renderVatsimAirports = <HomeVatsimAirportsList airports={vatsimAirports} />;
    } else if (vatsimAirportsFetching) {
        renderedAirport = <div className="text-lg text-center">Loading...</div>;
    } else if (vatsimAirportsError) {
        renderedAirport = <h3 className="text-lg text-center">Error Loading Vatsim Traffic</h3>;
    }

    if (vatsimEvents) {
        renderVatsimEvents = <HomeVatsimEvents vatsimEvents={vatsimEvents} />;
    } else if (vatsimEventsFetching) {
        renderVatsimEvents = <div className="text-lg text-center">Loading...</div>;
    } else if (vatsimEventsError) {
        renderVatsimEvents = <h3 className="text-lg text-center">Error Loading Vatsim Events</h3>;
    }

    useEffect(() => {
        if (vatsimEvents) {
            setVatsimEventsAvailable(true);
        }
    }, [vatsimEvents]);


    return (
        <>
            <Helmet>
                <title>Airport Weather</title>
                <meta
                    name="description"
                    content="Discover comprehensive airport information, real-time Vatsim traffic, and extreme weather conditions worldwide with our powerful aviation tool. Designed for Vatsim pilots and virtual aviation enthusiasts, our site provides accurate airport weather and METAR decoding, detailed airport data, and live Vatsim traffic and controller positions on an interactive map. Stay informed with our Extreme Weather section, highlighting the most challenging weather conditions for flight operations globally. Elevate your virtual flying experience with up-to-date information and seamless navigation."
                />
                <meta
                    name="keyword"
                    content="Airport weather, airport METAR, METAR decoded, VATSIM events, VATSIM map, VATSIM live traffic, extreme weather, extreme weather airport, bad weather airport,ATIS"
                />
                <link rel="canonical" href="https://airportweather.org" />
            </Helmet>
            <div className="flex flex-col flex-grow mr-0 ml-0">
                <ScrollToHashElement />
                <HomeHeroSection
                    backgroundImage={backgroundImage}
                    vatsimEvents
                />
                <CustomProvider theme={darkMode ? "dark" : "light"}>
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
                            id="current-vatsim-events"
                        >
                            Current Vatsim Events
                        </div>
                    </div>
                    <div>
                        {renderVatsimEvents}
                    </div>
                </CustomProvider>
            </div>
        </>
    );
}

export default Home;

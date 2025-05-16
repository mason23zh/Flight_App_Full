import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import backgroundImage from "../images/mika-baumeister-DHlZenOMjJI-unsplash.jpg";
import HeroSection from "./HeroSection";
import AirportsList from "./AirportsList";
import { useFetchAirportsWithGenericInputQuery } from "../store";
import { CustomProvider } from "rsuite";
import { useTheme } from "../hooks/ThemeContext";
import { Helmet } from "react-helmet-async";

function Airports() {
    const navigate = useNavigate();
    const darkMode = useTheme();
    const {
        pathname,
        state
    } = useLocation();
    const [userInput, setUserInput] = useState("");
    const [skipRender, setSkipRender] = useState(true);
    const [page, setPage] = useState(1);
    const [airportData, setAirportData] = useState();
    const message = " Airport information";
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
    } = useFetchAirportsWithGenericInputQuery({
        searchTerm: userInput,
        page,
        limit: 10
    }, {
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

    useEffect(() => {
        if (data && data.data.airports.length === 1) {
            const airport = data.data.airports[0];
            localStorage.setItem("airportData", JSON.stringify(airport));
            localStorage.setItem("airportListData", JSON.stringify(data));
            navigate(`/airport/detail/${airport.ICAO}`);
        } else if (data) {
            setAirportData(data);
        }
    }, [data, navigate]);

    const handleOnSubmit = (input: string) => {
        setUserInput(input);
        setSkipRender(false);
        setPage(1);
    };

    const onGoToPage = (inputPage: number) => {
        setPage(inputPage);
    };

    let renderedAirport: JSX.Element;
    if (isFetching) {
        renderedAirport = <div className="text-lg text-center">Loading...</div>;
    } else if (error) {
        renderedAirport = <div className="text-center"><h3>Error</h3></div>;
    } else if (airportData) {
        renderedAirport = <AirportsList airports={airportData} goToPage={onGoToPage} />;
    } else {
        renderedAirport = <div className="text-center text-xl"><h3>Enter search query</h3></div>;
    }

    return (
        <>
            <Helmet>
                <title>Airport Search | Find Global Airports, METARs & Weather</title>
                <meta
                    name="description"
                    content="Search airports by name, city, or ICAO code. Get detailed airport info, METARs, ATIS, and weather for global flight planning."
                />
                <link rel="canonical" href="https://airportweather.org/airport" />
            </Helmet>
            <CustomProvider theme={darkMode ? "dark" : "light"}>
                <div>
                    <HeroSection
                        backgroundImage={backgroundImage}
                        message={message}
                        placedHoldMessage={placeHolderMessage}
                        onSubmit={handleOnSubmit}
                    />
                    {renderedAirport}
                </div>
            </CustomProvider>
        </>
    );
}

export default Airports;
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomProvider, Input, InputGroup } from "rsuite";
import axios from "axios";
import { useTheme } from "../hooks/ThemeContext";
import InputAndSearch from "./InputAndSearch";
import globalAirportICAO from "../util/globalAirportICAO";


function HomeHeroSection({
    backgroundImage,
}) {
    const navigate = useNavigate();
    const [randAirport, setRandAirport] = useState(null);
    const [input, setInput] = useState("");
    
    const darkMode = useTheme();
    
    const getRandomAirport = () => globalAirportICAO[Math.floor(Math.random() * globalAirportICAO.length)];
    
    
    useEffect(() => {
        const randomICAO = getRandomAirport();
        
        const fetchRandomAirport = async (airportICAO) => {
            try {
                const response = await axios.get(`https://flight-data.herokuapp.com/api/v1/airports/icao/${airportICAO}?decode=true`);
                if (response) {
                    setRandAirport(response.data.data[0].airport);
                }
                return response.data;
            } catch (e) {
                return -1;
            }
        };
        
        fetchRandomAirport(randomICAO).catch((e) => {
            setRandAirport(-1);
        });
    }, []);
    
    
    const handleSubmitNew = (data) => {
        if (data.length !== 0) {
            setInput(data);
            navigate("/airport", { state: { userInput: data } });
        }
    };
    
    const handleRandomAirportClick = () => {
        if (randAirport !== -1) {
            localStorage.setItem("airportData", JSON.stringify(randAirport));
            navigate(`/airport/detail/${randAirport.ICAO}`);
        }
    };
    
    
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div
                className="w-screen h-screen bg-cover bg-no-repeat bg-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.1)), url(${backgroundImage})`,
                }}
            >
                <div className="absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[55%]
                     transition-all ease-in-out duration-300
                     w-[90%] sm:w-[60%] md:w-[50%] h-fit"
                >
                    <div
                        className=""
                    >
                        <div className="flex flex-col items-center gap-5">
                            <h2 className="text-center text-lg text-white sm:text-2xl md:text-white md:text-3xl">Get
                                METARs,
                                Airports and
                                More
                            </h2>
                            <div className="self-stretch ml-5 mr-5">
                                <InputAndSearch
                                    placeholder="ICAO, IATA, name..."
                                    onSubmit={handleSubmitNew}
                                />
                            </div>
                            <div className="grid grid-cols-1 items-center text-center
                            justify-center md:grid-cols-3 md:gap-4 w-full"
                            >
                                <div className="md:justify-self-end p-2 text-white text-[16px]">
                                    <button className="hover:italic" onClick={handleRandomAirportClick}>
                                        Random Airport
                                    </button>
                                </div>
                                <div className="p-2 text-white text-[16px]">
                                    <Link
                                        to="/#popular-vatsim-airports"
                                        className="hover:no-underline hover:text-white hover:italic hover:inline-block visited:text-white"
                                    >
                                        Popular Vatsim Airports
                                    </Link>
                                </div>
                                <div className="md:justify-self-start p-2 text-white text-[16px]">
                                    <Link
                                        to="/#popular-airports"
                                        className="hover:no-underline hover:text-white hover:italic visited:text-white"
                                    >
                                        Popular Airports
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomProvider>
    );
}

export default HomeHeroSection;

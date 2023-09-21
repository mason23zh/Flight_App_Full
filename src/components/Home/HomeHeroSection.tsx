'use client'

import React, { useEffect, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CustomProvider, Input, InputGroup } from "rsuite";
import axios from "axios";
import { useTheme } from "@/hooks/ThemeContext";
import InputAndSearch from "@/components/InputAndSearch";
import globalAirportICAO from "@/utils/globalAirportICAO";


function HomeHeroSection({
    backgroundImage,
}) {
    const router = useRouter();
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
    
    
    const handleSubmitNew = (data: string) => {
        if (data.length !== 0) {
            setInput(data);
            // router.push("/airport/detail", { code: data });
            router.push("/airport/detail?icao="+ data)
        }
    };
    
    const handleRandomAirportClick = () => {
        if (randAirport !== -1) {
            localStorage.setItem("airportData", JSON.stringify(randAirport));
            if (randAirport?.ICAO)
                // router.push("/airport/detail", { code: randAirport.ICAO });
                router.push("/airport/detail?icao="+ randAirport.ICAO)
        }
    };
    
    
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div
                className="w-full h-[100vh] bg-cover bg-no-repeat bg-center"
                style={{
                    // filter: darkMode ? "brightness(100%)" : "brightness(100%)",
                    // backgroundImage: `linear-gradient(rgba(184,182,169,0.2), rgba(5,16,2,0.8)), url(${backgroundImage})`,
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.1)), url(${backgroundImage.src})`,
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
                            <div className="grid grid-cols-1 items-center text-center justify-center md:grid-cols-3 md:gap-2">
                                <div className="md:justify-self-start p-2 text-white text-[16px]">
                                    <button className="hover:italic" onClick={handleRandomAirportClick}>
                                        Random Airport
                                    </button>
                                </div>
                                <div className="p-2 text-white text-[16px]">
                                    <Link
                                        href={{ pathname: "/", hash: 'popular-vatsim-airports' }}
                                        className="hover:no-underline hover:text-white hover:italic hover:inline-block visited:text-white"
                                    >
                                        Popular Vatsim Airports
                                    </Link>
                                </div>
                                <div className="md:justify-self-end p-2 text-white text-[16px]">
                                    <Link
                                        href={{ pathname: "/", hash: 'popular-airports' }}
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

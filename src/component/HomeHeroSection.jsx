import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomProvider, Input, InputGroup } from "rsuite";
import { useTheme } from "../hooks/ThemeContext";
import InputAndSearch from "./InputAndSearch";


function HomeHeroSection({
    backgroundImage, onSectionSelect,
}) {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    
    
    const darkMode = useTheme();
    const inputFiledTheme = darkMode
        ? "rounded-xl border-2 w-auto sm:w-full h-10 text-gray-200 px-4 text-[17px] bg-gray-800 border-gray-700"
        : "rounded-xl border-2 w-auto sm:w-full h-10 text-black px-4 text-[17px]";
    
    const submitButtonTheme = darkMode
        ? "px-3 py-1 text-white border-gray-800 border-2"
            + " rounded-xl text-xl bg-gray-900 "
            + " bg-opacity-70 text-opacity-80 hover:bg-opacity-95"
            + " transition duration-200 ease-in-out"
        : "px-3 py-1 text-black border-white border-2"
            + " rounded-xl text-xl bg-white bg-opacity-50"
            + " text-opacity-80 hover:bg-opacity-90"
            + " transition duration-200 ease-in-out";
    
    const handleSubmitNew = (data) => {
        if (data.length !== 0) {
            setInput(data);
            navigate("/airport", { state: { userInput: data } });
        }
    };
    
    
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div
                className="w-screen h-screen bg-cover bg-no-repeat bg-center bg-fixed"
                style={{
                    filter: darkMode ? "brightness(100%)" : "brightness(100%)",
                    // backgroundImage: `linear-gradient(rgba(184,182,169,0.2), rgba(5,16,2,0.8)), url(${backgroundImage})`,
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.1)), url(${backgroundImage})`,
                }}
            >
                <div className="absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[45%]
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
                            {/* <div className="grid grid-cols-1 justify-center md:grid-cols-3 gap-5 text-center"> */}
                            {/*    <div className="md:justify-self-start p-2 text-white text-[16px]"> */}
                            {/*        <button className=""> */}
                            {/*            Random Airport */}
                            {/*        </button> */}
                            {/*    </div> */}
                            {/*    <div className="p-2 text-white text-[16px]"> */}
                            {/*        <Link */}
                            {/*            to="/#popular-vatsim-airports" */}
                            {/*            className="hover:no-underline hover:text-white hover:italic hover:inline-block" */}
                            {/*        > */}
                            {/*            Popular Vatsim Airports */}
                            {/*        </Link> */}
                            {/*    </div> */}
                            {/*    <div className="md:justify-self-end p-2 text-white text-[16px]"> */}
                            {/*        <Link */}
                            {/*            to="/#popular-airports" */}
                            {/*            className="hover:no-underline hover:text-white hover:italic" */}
                            {/*        > */}
                            {/*            Popular Airports */}
                            {/*        </Link> */}
                            {/*    </div> */}
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </CustomProvider>
    );
}

export default HomeHeroSection;

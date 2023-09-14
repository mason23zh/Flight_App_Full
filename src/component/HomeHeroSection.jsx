import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomProvider } from "rsuite";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { useTheme } from "../hooks/ThemeContext";

function HomeHeroSection({ backgroundImage }) {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (input.length !== 0) {
            setInput(input);
            navigate("/airport", { state: { userInput: input } });
        }
    };
    const darkMode = useTheme();
    const inputFiledTheme = darkMode
        ? "rounded-xl border-2 w-full md:w-full h-10 text-gray-200 pl-3 text-[17px] bg-black border-gray-700"
        : "rounded-xl border-2 w-full md:w-full h-10 text-black pl-3 text-[17px]";
    
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div
                className="w-screen h-screen bg-cover bg-no-repeat bg-center bg-fixed"
                style={{
                    filter: darkMode ? "brightness(90%)" : "brightness(100%)",
                    backgroundImage: `linear-gradient(rgba(184,182,169,0.2), rgba(5,16,2,0.8)), url(${backgroundImage})`,
                }}
            >
                <div className="absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[40%]
                     transition-all ease-in-out duration-300
                     w-auto h-fit"
                >
                    <form
                        onSubmit={handleFormSubmit}
                        className=""
                    >
                        <div className="flex flex-col items-center justify-center gap-5">
                            <h2 className="text-center text-lg text-white sm:text-2xl md:text-white md:text-3xl">Get
                                METARs,
                                Airports and
                                More
                            </h2>
                            <input
                                onChange={handleInputChange}
                                value={input}
                                className={inputFiledTheme}
                                placeholder="Search ICAO, IATA, airport name, city..."
                            />
                            <button
                                type="submit"
                                className="px-3 py-1 text-black border-white border-2
                                    rounded-xl text-xl bg-white bg-opacity-50
                                    text-opacity-80 hover:bg-opacity-90
                                    transition duration-200 ease-in-out"
                            >Get Data
                            </button>
                        </div>
                    </form>
                </div>
                <div className="absolute bottom-[8%] right-1/2 translate-x-1/2">
                    <MdKeyboardDoubleArrowDown size={40} color="#ffffff8f" />
                </div>
            </div>
        </CustomProvider>
    );
}

export default HomeHeroSection;

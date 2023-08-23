import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomProvider } from "rsuite";
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
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div>
                <div
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        height: "960px",
                        width: "auto",
                        position: "relative",
                    }}
                />
                <form
                    onSubmit={handleFormSubmit}
                    className="absolute translate-x-[-50%] translate-y-[-130%] left-[50%] top-[50%]
                    transition-all ease-in-out duration-300
                    w-auto h-auto md:translate-y-[-50%] "
                >
                    <div className="flex flex-col items-center justify-center gap-5">
                        <h2 className="text-center text-lg text-gray-700 sm:text-2xl md:text-white md:text-3xl">Get
                            METARs,
                            Airports and
                            More
                        </h2>
                        <input
                            onChange={handleInputChange}
                            value={input}
                            className="rounded-xl border-2 w-full md:w-full h-10 text-black pl-3"
                            placeholder="Search ICAO code, IATA code, airport name, city..."
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
        </CustomProvider>
    );
}

export default HomeHeroSection;

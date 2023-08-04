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
    const darkmode = useTheme();
    const themeMode = darkmode ? "dark" : "light";
    
    
    return (
        <CustomProvider theme={themeMode}>
            <div className="relative">
                <div
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        height: "960px",
                        width: "auto",
                    }}
                />
                <form onSubmit={handleFormSubmit} className="absolute top-[38%] left-[38%]">
                    <div className="flex flex-col items-center justify-center gap-7">
                        <h2 className="text-white text-4xl">Get METARs, airports and more</h2>
                        <input
                            onChange={handleInputChange}
                            value={input}
                            className="rounded-xl border-2 w-full h-10 text-black"
                            placeholder="   Search ICAO code, IATA code, airport name, city..."
                        />
                        <button
                            type="submit"
                            className="px-3 py-1 text-white border-white border-2 rounded-xl text-xl"
                        >Get Data
                        </button>
                    </div>
                </form>
            </div>
        </CustomProvider>
    );
}

export default HomeHeroSection;

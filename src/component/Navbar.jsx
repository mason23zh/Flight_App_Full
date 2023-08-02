import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { IoMoon, IoSunny, IoSunnyOutline } from "react-icons/io5";
import { useTheme, useThemeUpdate } from "../hooks/ThemeContext";

function Navbar() {
    const darkTheme = useTheme();
    const toggleTheme = useThemeUpdate();
    
    const navigate = useNavigate();
    const [searchPlaceHolder, setSearchPlaceHolder] = useState("Search Something!");
    const [searchInput, setSearchInput] = useState("");
    const [nightMode, setNightMode] = useState(darkTheme);
    
    useEffect(() => {
        setNightMode(darkTheme);
    }, [darkTheme]);
    
    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.length === 0) {
            setSearchPlaceHolder("Something !== nothing :)");
        } else {
            setSearchInput(searchInput);
            setSearchInput("");
            setSearchPlaceHolder("Search Something!");
            navigate("/airport", { state: { userInput: searchInput } });
        }
    };
    
    const nightModeToggleSwitch = (
        <div
            onClick={toggleTheme}
            className="cursor-pointer transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 "
        >
            {nightMode ? <IoSunnyOutline /> : <IoMoon />}
        </div>
    );
    
    
    return (
        <nav className="flex justify-between py-1 px-5 mb-1">
            <ul className="list-none flex items-center gap-3 text-lg">
                <li>
                    <Link className="m-0 text-red-500" to="/">
                        BETA
                    </Link>
                </li>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/airport">Airport</Link>
                </li>
                <li>
                    <Link to="/weather">Weather</Link>
                </li>
                <li>
                    <Link to="/extreme-weather" className="text-red-400">
                        Extreme weather
                    </Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <div className="text-xl">
                    {nightModeToggleSwitch}
                </div>
            </ul>
                
            <form onSubmit={handleSearchSubmit} className="hidden md:flex gap-3">
                <input
                    value={searchInput}
                    placeholder={searchPlaceHolder}
                    onChange={handleInputChange}
                    type="text"
                    className="border-2 rounded-lg py-1 px-3"
                />
                <button type="submit" className="rounded-lg bg-green-400 py-1 px-3">Get Result</button>
            </form>
        </nav>
    );
}

export default Navbar;
 

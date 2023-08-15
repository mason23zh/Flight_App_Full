import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { IoMoon, IoSunnyOutline } from "react-icons/io5";
import { useTheme, useThemeUpdate } from "../hooks/ThemeContext";
import NavbarDropDown from "./NavbarDropDown";

function Navbar() {
    const toggleTheme = useThemeUpdate();
    const darkMode = useTheme();
    
    const navBarSubmitButtonClass = darkMode
        ? "rounded-lg bg-green-500 text-white py-1 px-3"
        : "rounded-lg bg-green-400 py-1 px-3";
    const navBarBgTheme = darkMode
        ? "flex justify-between py-1 px-5"
        : "flex justify-between py-1 px-5 bg-gray-100";
    
    const navigate = useNavigate();
    const [searchPlaceHolder, setSearchPlaceHolder] = useState("Search Something!");
    const [searchInput, setSearchInput] = useState("");
    
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
        <div className="flex flex-row gap-1 justify-center items-center">
            <div>|</div>
            <div
                onClick={toggleTheme}
                className=" cursor-pointer transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 "
            >
                    
                {darkMode ? <IoSunnyOutline /> : <IoMoon />}
                
            </div>
        </div>
    );
    
    
    return (
        <nav className={navBarBgTheme}>
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
                <NavbarDropDown />
            </ul>
                
            <form onSubmit={handleSearchSubmit} className="hidden md:flex gap-3">
                <input
                    value={searchInput}
                    placeholder={searchPlaceHolder}
                    onChange={handleInputChange}
                    type="text"
                    className="border-2 rounded-lg py-1 px-3 text-black"
                />
                <button type="submit" className={navBarSubmitButtonClass}>Get Result</button>
            </form>
        </nav>
    );
}

export default Navbar;
 

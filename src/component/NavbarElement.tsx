import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMoon, IoSunnyOutline } from "react-icons/io5";
import { useTheme, useThemeUpdate } from "../hooks/ThemeContext";
import logo from "../images/logo.png";
import InputAndSearch from "./InputAndSearch";

function NavbarElement() {
    const toggleTheme = useThemeUpdate();
    const darkMode = useTheme();
    const location = useLocation();

    // const navBarSubmitButtonClass = darkMode
    //     ? "rounded-lg bg-green-500 text-white py-1 px-3"
    //     : "rounded-lg bg-green-400 py-1 px-3";
    // 56px = 42pt
    const navBarBgTheme = darkMode
        ? "flex justify-between py-1 px-5 bg-gray-900 w-full text-gray-300 h-auto border-b-2 border-gray-700 drop-shadow-lg"
        : "flex justify-between py-1 px-5 bg-gray-100 w-full text-gray-700 h-auto";
    // const navBarInputTheme = darkMode
    //     ? "border-2 rounded-lg py-1 px-3 text-black text-[17px] bg-gray-900 border-gray-700 text-gray-200"
    //     : "border-2 rounded-lg py-1 px-3 text-black text-[17px]";

    const navigate = useNavigate();
    const [searchPlaceHolder, setSearchPlaceHolder] = useState("Search Something!");
    const [searchInput, setSearchInput] = useState("");

    const handleSearchSubmit = (input) => {
        if (input.length === 0) {
            setSearchPlaceHolder("Something !== nothing :)");
        } else {
            setSearchInput(input);
            setSearchInput("");
            setSearchPlaceHolder("Search Something!");
            navigate("/airport", { state: { userInput: input } });
        }
    };

    const nightModeToggleSwitch = (
        <div className="flex flex-row gap-1 justify-center items-center">
            <div>|</div>
            <div
                onClick={toggleTheme}
                className="cursor-pointer transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 "
            >
                {darkMode ? <IoSunnyOutline /> : <IoMoon />}
            </div>
        </div>
    );

    return (
        <nav className={navBarBgTheme}>
            <ul className="list-none flex items-center gap-3 text-lg">
                <li>
                    <Link className="m-0 text-red-500" style={{ textDecoration: "none" }} to="/">
                        <img src={logo} width={25} height={25} alt="logoIcon" />
                    </Link>
                </li>
                <li>
                    <Link style={{ textDecoration: "none" }} to="/">
                        Home
                    </Link>
                </li>
                <li>
                    <Link style={{ textDecoration: "none" }} to="/airport">
                        Airport
                    </Link>
                </li>
                <li>
                    <Link style={{ textDecoration: "none" }} to="/weather">
                        Weather
                    </Link>
                </li>
                <li>
                    <Link
                        style={{ textDecoration: "none" }}
                        to="/extreme-weather"
                        className="text-red-400"
                    >
                        Extreme Weather
                    </Link>
                </li>
                <li>
                    <Link style={{ textDecoration: "none" }} to="/vatsim/events" className="">
                        Events
                    </Link>
                </li>
                <li>
                    <Link style={{ textDecoration: "none" }} to="/map" className="">
                        Map
                    </Link>
                </li>
                <li>
                    <Link style={{ textDecoration: "none" }} to="/about">
                        About
                    </Link>
                </li>
                <div className="text-xl">{nightModeToggleSwitch}</div>
            </ul>

            {location.pathname !== "/map" && (
                <InputAndSearch onSubmit={handleSearchSubmit} placeholder="Search Something!" />
            )}
        </nav>
    );
}

export default NavbarElement;

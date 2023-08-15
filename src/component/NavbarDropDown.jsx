import React from "react";
import Dropdown from "rsuite/Dropdown";
import { Link } from "react-router-dom";
import { IoListOutline, IoMoon, IoSunnyOutline } from "react-icons/io5";
import { useTheme, useThemeUpdate } from "../hooks/ThemeContext";

function NavbarDropDown() {
    const toggleTheme = useThemeUpdate();
    const darkMode = useTheme();
    return (
        <div>
            <Dropdown title={<IoListOutline />} noCaret>
                <Dropdown.Item>
                    <Link style={{ textDecoration: "none" }} to="/airport">Airport</Link>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Link style={{ textDecoration: "none" }} to="/weather">Weather</Link>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Link style={{ textDecoration: "none" }} to="/extreme-weather" className="text-red-400">
                        Extreme weather
                    </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Link style={{ textDecoration: "none" }} to="/about">About</Link>
                </Dropdown.Item>
                <Dropdown.Item>
                    <div
                        className="flex flex-row justify-center items-center gap-4"
                        onClick={toggleTheme}
                    >
                        <div>
                            Switch Theme
                        </div>
                        <div>{darkMode ? <IoSunnyOutline /> : <IoMoon />}</div>
                    </div>
                </Dropdown.Item>
            </Dropdown>
        </div>
    );
}

export default NavbarDropDown;

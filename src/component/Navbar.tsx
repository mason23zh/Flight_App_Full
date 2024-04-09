import React from "react";
import { Link } from "react-router-dom";
import NavbarElement from "./NavbarElement";
import NavbarDropDown from "./NavbarDropDown";
import { useTheme } from "../hooks/ThemeContext";
import logo from "../images/logo.png";

function Navbar() {
    const darkMode = useTheme();
    const navDropDownTheme = darkMode
        ? "flex flex-row justify-between items-center pr-3 pl-3 bg-gray-900 md:hidden"
        : "flex flex-row justify-between items-center pr-3 pl-3 bg-gray-100 md:hidden";

    console.log("Nav dropdown theme:", navDropDownTheme);

    return (
        <nav className="main-navbar">
            <div className="hidden transition-all ease-in-out duration-1000 md:block">
                <NavbarElement/>
            </div>
            <div className={navDropDownTheme}>
                <div>
                    <Link to="/">
                        <img src={logo} width={25} height={25} alt="logoIcon"/>
                    </Link>
                </div>
                <div>
                    <NavbarDropDown/>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
 

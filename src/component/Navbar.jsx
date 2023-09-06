import React from "react";
import { Link } from "react-router-dom";
import NavbarElement from "./NavbarElement";
import NavbarDropDown from "./NavbarDropDown";
import { useTheme } from "../hooks/ThemeContext";
import logo from "../images/logo.png";

function Navbar() {
    const darkMode = useTheme();
    const navDropDownTheme = darkMode
        ? "flex flex-row justify-between items-center pr-3 pl-3 md:hidden"
        : "flex flex-row justify-between items-center pr-3 pl-3 bg-gray-100 md:hidden";
    
    const style = {
        width: "200px",
        padding: "5px",
        display: "flex",
    };
    
    return (
        <>
            <div className="hidden transition-all ease-in-out duration-1000 md:block">
                <NavbarElement />
            </div>
            <div className={navDropDownTheme}>
                <div>
                    <Link to="/">
                        <img src={logo} width={25} height={25} alt="logoIcon" />
                    </Link>
                </div>
                <div>
                    <NavbarDropDown />
                </div>
            </div>
        </>
    );
}

export default Navbar;
 

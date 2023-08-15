import React from "react";
import NavbarElement from "./NavbarElement";
import NavbarDropDown from "./NavbarDropDown";
import { useTheme } from "../hooks/ThemeContext";

function Navbar() {
    const darkMode = useTheme();
    const navDropDownTheme = darkMode
        ? "flex flex-row justify-between items-center pr-3 pl-3 md:hidden"
        : "flex flex-row justify-between items-center pr-3 pl-3 bg-gray-100 md:hidden";
    
    
    return (
        <>
            <div className="lgMd:hidden">
                <NavbarElement />
            </div>
            <div className={navDropDownTheme}>
                <div>
                    LOGO
                </div>
                <div>
                    <NavbarDropDown />
                </div>
            </div>
        </>
    );
}

export default Navbar;
 

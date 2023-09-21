'use client'

import React from "react";
import Link from "next/link";
import NavbarElement from "./NavbarElement";
import NavbarDropDown from "./NavbarDropDown";

import { useTheme } from "@/hooks/ThemeContext";

import Image from 'next/image'
import logo from "@/../public/images/logo.png";

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
                    <Link href="/">
                        <img src={logo.src} width={25} height={25} alt="logoIcon" />
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
 

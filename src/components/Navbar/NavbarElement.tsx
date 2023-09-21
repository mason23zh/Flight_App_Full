'use client'
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { IoMoon, IoSunnyOutline } from "react-icons/io5";
import { useTheme, useThemeUpdate } from "@/hooks/ThemeContext";
// import logo from "/images/logo.png";
import InputAndSearch from "../InputAndSearch";
import logo from "@/../public/images/logo.png";

function NavbarElement() {
    const toggleTheme = useThemeUpdate();
    const darkMode = useTheme();
    
    const navBarSubmitButtonClass = darkMode
        ? "rounded-lg bg-green-500 text-white py-1 px-3"
        : "rounded-lg bg-green-400 py-1 px-3";
        // TODO figure out the cause
    const navBarBgTheme = darkMode
        ? "flex justify-between py-1 px-5"
        : "flex justify-between py-1 px-5 bg-gray-100 w-100vw";
    const navBarInputTheme = darkMode
        ? "border-2 rounded-lg py-1 px-3 text-black text-[17px] bg-gray-900 border-gray-700 text-gray-200"
        : "border-2 rounded-lg py-1 px-3 text-black text-[17px]";
    
    // const navigate = useNavigate();
    const router = useRouter();
    const [searchPlaceHolder, setSearchPlaceHolder] = useState("Search Something!");
    const [searchInput, setSearchInput] = useState("");
    
    // const handleInputChange = (e) => {
    //     setSearchInput(e.target.value);
    // };
    //
    const handleSearchSubmit = (input: string) => {
        if (input.length === 0) {
            setSearchPlaceHolder("Something !== nothing :)");
        } else {
            setSearchInput(input);
            setSearchInput("");
            setSearchPlaceHolder("Search Something!");
            // navigate("/airport", { state: { userInput: input } });
            router.push("/airport", { state: { userInput: input } } as any)
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
                    <Link className="m-0 text-red-500" style={{ textDecoration: "none" }} href="/">
                        <img src={logo.src} width={25} height={25} alt="logoIcon" />
                    </Link>
                </li>
                <li>
                    <Link style={{ textDecoration: "none" }} href="/">Home</Link>
                </li>
                <li>
                    <Link style={{ textDecoration: "none" }} href="/airport">Airport</Link>
                </li>
                <li>
                    <Link style={{ textDecoration: "none" }} href="/weather">Weather</Link>
                </li>
                <li>
                    <Link style={{ textDecoration: "none" }} href="/extreme-weather" className="text-red-400">
                        Extreme Weather
                    </Link>
                </li>
                <li>
                    <Link style={{ textDecoration: "none" }} href="/about">About</Link>
                </li>
                <div className="text-xl">
                    {nightModeToggleSwitch}
                </div>
            </ul>
            <InputAndSearch
                onSubmit={handleSearchSubmit}
                placeholder="Search Something!"
            />
        </nav>
    );
}

export default NavbarElement;

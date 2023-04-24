import { Link } from "react-router-dom";
import React, { useState } from "react";

function Navbar() {
    const [searchInput, setSearchInput] = useState("");

    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log(searchInput);
    };

    return (
        <nav className="flex justify-between py-1 px-5 mb-1">
            <ul className="list-none flex items-center gap-3 text-lg">
                <li>
                    <Link className="m-0" to="/">
                        PlaceHolderName
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
            </ul>
            <form onSubmit={handleSearchSubmit} className="flex gap-3">
                <input
                    value={searchInput}
                    placeholder="Search Something!"
                    onChange={handleInputChange}
                    type="text"
                    className="border-2 rounded-lg py-1 px-3"
                />
                <button className="rounded-lg bg-green-400 py-1 px-3">Get Result</button>
            </form>
        </nav>
    );
}

export default Navbar;

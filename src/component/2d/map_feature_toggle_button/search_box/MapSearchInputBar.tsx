import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const MapSearchInputBar = ({
    searchInput,
    handleChange,
    darkMode
}) => {
    const inputTheme = darkMode
        ? "w-full p-2 pl-3 flex-grow-2 border-none "
            + "rounded-r-3xl text-[16px] focus:outline-0 "
            + "focus:shadow-inner hover:shadow-inner bg-gray-800"
        : "w-full p-2 pl-3 flex-grow-2 border-none "
            + "rounded-r-3xl text-[16px] focus:outline-0 "
            + "focus:shadow-inner hover:shadow-inner";

    return (
        <div className="p-2 flex flex-row border-1">
            <div className="p-2 pr-3 bg-gray-200 rounded-l-3xl">
                <AiOutlineSearch size={18}/>
            </div>
            <input
                type="text"
                placeholder="search something"
                value={searchInput}
                onChange={handleChange}
                className={inputTheme}
            />
        </div>
    );
};

export default MapSearchInputBar;
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useTheme } from "../hooks/ThemeContext";

function InputAndSearch({
    placeholder,
    onSubmit,
}) {
    const darkMode = useTheme();
    const inputTheme = darkMode
        ? "w-full p-2 pl-3 flex-grow-2 border-none "
            + "rounded-l-3xl text-[16px] focus:outline-0 "
            + "focus:shadow-inner hover:shadow-inner bg-gray-800"
        : "w-full p-2 pl-3 flex-grow-2 border-none "
            + "rounded-l-3xl text-[16px] focus:outline-0 "
            + "focus:shadow-inner hover:shadow-inner";
    const buttonTheme = darkMode
        ? "p-2 pr-3 bg-gray-700 rounded-r-3xl hover:bg-gray-600"
        : "p-2 pr-3 bg-gray-200 rounded-r-3xl hover:bg-gray-300";

    const [input, setInput] = useState("");
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(input);
        setInput("");
    };
    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-row border-1
             border-gray-700 p-1 drop-shadow-sm
             hover:drop-shadow-2xl"
        >
            <input
                id="UserInput"
                className={inputTheme}
                onChange={handleInputChange}
                placeholder={placeholder}
                value={input}
            />
            <button
                type="submit"
                className={buttonTheme}
            >
                <AiOutlineSearch/>
            </button>
        </form>
    );
}

export default InputAndSearch;

import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

function InputAndSearch({
    placeholder, onSubmit,
}) {
    const [input, setInput] = useState("");
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(input);
    };
    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-row border-1
             border-gray-700 p-1 drop-shadow-sm
             hover:drop-shadow-2xl"
        >
            <input
                className="w-full p-2 pl-3 flex-grow-2
                border-none rounded-l-3xl text-[16px] focus:outline-0
                focus:shadow-inner hover:shadow-inner"
                onChange={handleInputChange}
                placeholder={placeholder}
                value={input}
            />
            <button
                type="submit"
                className="p-2 pr-3 bg-gray-200 rounded-r-3xl hover:bg-gray-400"
            >
                <AiOutlineSearch />
            </button>
        </form>
    );
}

export default InputAndSearch;

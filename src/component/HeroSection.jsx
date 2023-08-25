import React, { useState } from "react";

function HeroSection({
    backgroundImage, message, placedHoldMessage, onSubmit,
}) {
    const [input, setInput] = useState("");
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (input.length !== 0) {
            onSubmit(input);
            setInput("");
        }
    };
    
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };
    return (
        <div className="relative">
            <div
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    height: "200px",
                    width: "auto",
                }}
            />
            <form
                onSubmit={handleFormSubmit}
                className="absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%]"
            >
                <div className="flex flex-col items-center justify-center gap-3">
                    <h2 className="w-auto text-center text-white text-2xl sm:text-3xl md:text-4xl">{message}
                    </h2>
                    <input
                        onChange={handleInputChange}
                        value={input}
                        className="rounded-xl border-2 w-auto
                        sm:w-[400px] h-10 text-black
                        transition-all ease-in-out duration-300 pl-3 text-[17px]"
                        placeholder={`${placedHoldMessage}`}
                    />
                    <button
                        type="submit"
                        className="text-xl px-3 py-1 text-black border-white
                        border-2 rounded-xl text-xl bg-white
                        bg-opacity-60 text-opacity-80 hover:bg-opacity-80
                        transition duration-200 ease-in-out"
                    >Get Data
                    </button>
                </div>
            </form>
        </div>
    );
}

export default HeroSection;

import React, { useState } from "react";

function HeroSection({
    backgroundImage, message, placedHoldMessage, onSubmit,
}) {
    const [input, setInput] = useState("");

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(input);
        setInput("");
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
                    <h2 className="text-white text-4xl">{message}</h2>
                    <input
                        onChange={handleInputChange}
                        value={input}
                        className="rounded-xl border-2 w-full h-10"
                        placeholder={`  ${placedHoldMessage}`}
                    />
                    <button type="submit" className="px-3 py-1 text-white border-white border-2 rounded-xl text-xl">Get Data</button>
                </div>
            </form>
        </div>
    );
}

export default HeroSection;

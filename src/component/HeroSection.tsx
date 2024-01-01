import React from "react";
import InputAndSearch from "./InputAndSearch";
 
function HeroSection({
    backgroundImage,
    message,
    placedHoldMessage,
    onSubmit,
}) {
    const handleFormSubmit = (userInput: string) => {
        if (userInput.length !== 0) {
            onSubmit(userInput);
        }
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
            <div
                className="absolute translate-x-[-50%] translate-y-[-50%] left-[50%]
                transition-all ease-in-out duration-300 
                top-[50%] w-[80%] sm:w-[60%] md:w-[50%] h-fit"
            >
                <div className="flex flex-col items-center justify-center gap-3">
                    <h2 className="w-auto text-center text-white text-2xl sm:text-3xl md:text-4xl">
                        {message}
                    </h2>
                    <div className="self-stretch ml-5 mr-5">
                        <InputAndSearch placeholder={placedHoldMessage} onSubmit={handleFormSubmit}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;

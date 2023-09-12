import React, { useState } from "react";
import { CustomProvider } from "rsuite";
import AudioPlayer from "react-h5-audio-player";
import morseCode from "../assets/morseCode.mp3";
import { useTheme } from "../hooks/ThemeContext";
import "react-h5-audio-player/lib/styles.css";

function Puzzles() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState(false);
    const darkMode = useTheme();
    
    
    const renderCodedImg = (
        <div className="border-2 p-5">
            <p className="break-words">
                data:image/png;base64,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
            </p>
        </div>
    );
    
    const handleInputChange = (e) => {
        setInput(e.target.value);
        if (e.target.value === "1013") {
            setResult(true);
        }
    };
    
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div>
                <div className="grid grid-cols-1 gap-4 justify-items-center">
                    <div className="text-2xl md:text-4xl">Finding Orion</div>
                    <div>
                        <AudioPlayer
                            src={morseCode}
                            
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            className="border-2 w-full text-[16px] text-black"
                            onChange={handleInputChange}
                            value={input}
                            placeholder="Enter your answer"
                        />
                    </div>
                    
                </div>
                {result && renderCodedImg}
            </div>
        </CustomProvider>
    );
}

export default Puzzles;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { CustomProvider } from "rsuite";
import AudioPlayer from "react-h5-audio-player";
import morseCode from "../assets/morseCode.mp3";
import { useTheme } from "../hooks/ThemeContext";
import "react-h5-audio-player/lib/styles.css";

function Puzzles() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [checkAnswer, setCheckAnswer] = useState();
    
    const darkMode = useTheme();
    
    const buttonTheme = darkMode
        ? "bg-gray-400 text-white"
        : "bg-gray-200 text-gray-700";
    
    
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("https://flight-data.herokuapp.com/api/v1/puzzle/check-answer", {
            code: input,
        }).then((results) => {
            if (results.data.status === "fail") {
                setCheckAnswer(false);
            } else if (results.data.status === "success") {
                setResult(results.data.base64);
            }
        });
    };
    
    const renderAnswer = () => {
        if (result.length > 10) {
            return (
                <div>
                    <img
                        alt="code"
                        src={result}
                    />
                </div>
            );
        }
        if (checkAnswer === false) {
            return (
                <div>
                    Wrong Answer
                </div>
            );
        }
        return (<></>);
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
                    <form className="flex gap-2" onSubmit={handleSubmit}>
                        <input
                            className="border-2 w-full text-[16px] text-black"
                            onChange={handleInputChange}
                            value={input}
                            placeholder="Enter your answer"
                        />
                        <button className={buttonTheme}>Check Answer</button>
                    </form>
                    
                </div>
                <div className="grid grid-cols-1 justify-items-center mt-10">
                    {renderAnswer()}
                </div>
            </div>
        </CustomProvider>
    );
}

export default Puzzles;

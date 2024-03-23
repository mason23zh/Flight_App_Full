import React from "react";
import { IoIosAirplane } from "react-icons/io";


const FlightProgressBar = ({ progress }) => {
    const progressStyle = { width: `${progress}%` };

    // The iconStyle dynamically adjusts the left position of the icon
    // The transform translateX(-50%) centers the icon at its middle point on the progress bar
    const iconStyle = {
        left: `${progress}%`,
        transform: "translateX(-50%)"
    };

    return (
        <div className="relative w-full bg-gray-200 rounded-full h-6 dark:bg-gray-700">
            <div
                className="absolute z-10"
                style={{ left: `calc(${progress}% - 12px)` }} // Adjust 12px based on the actual size of the icon
            >
                <IoIosAirplane className="text-green-500 text-xl" style={{
                    top: "50%",
                    transform: "translateY(-50%)"
                }}/>
            </div>
            <div
                className="bg-green-500 h-full rounded-full transition-all ease-linear duration-150"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

export default FlightProgressBar;

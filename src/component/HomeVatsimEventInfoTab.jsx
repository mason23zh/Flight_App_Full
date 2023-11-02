import React from "react";
import moment from "moment";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useTheme } from "../hooks/ThemeContext";

function HomeVatsimEventInfoTab({ event, counter }) {
    const {
        airports,
        banner,
        description,
        end_time,
        start_time,
        link,
        name,
        organisers,
        short_description,
    } = event;
    
    const darkMode = useTheme();
    const themeClass = darkMode
        ? "border-2 rounded-3xl grid grid-cols-3 "
            + "sm:grid-cols-4 md:grid-cols-5 text-center justify-items-center items-center "
            + "h-full bg-gray-500"
        : "border-2 rounded-3xl grid grid-cols-3 "
            + "sm:grid-cols-4 md:grid-cols-5 text-center justify-items-center items-center "
            + "h-full bg-gray-300";
    
    const nameSection = (
        <div className="items-center">
            {name}
        </div>
    );
    
    const timeSection = (
        <div>
            {moment(start_time).utc().format("HH:mm")} to {moment(end_time).utc()
                .format("HH:mm")} (UTC)
        </div>
    );
    
    const counterSection = (
        <div className="border-1">
            #{counter + 1}
        </div>
    );
    
    const linkSection = (
        <div>
            <a href={link} target="_blank" rel="noreferrer">
                Event Link
            </a>
        </div>
    );
    
    const goToSection = (
        <div>
            <IoIosArrowRoundForward size={40} />
        </div>
    );
    
    
    return (
        <div className={themeClass}>
            <div className="justify-self-start ml-4 p-2 hidden md:block">
                {counterSection}
            </div>
            <div className="justify-self-start p-2 ml-1 md:ml-0 md:justify-self-center">
                {nameSection}
            </div>
            <div className="p-2 ">
                {timeSection}
            </div>
            <div className="p-2 justify-self-center hidden sm:block">
                {linkSection}
            </div>
            <div className="justify-self-end mr-3">
                {goToSection}
            </div>
        </div>
    );
}

export default HomeVatsimEventInfoTab;

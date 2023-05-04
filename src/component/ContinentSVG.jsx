import React from "react";
import AFRICA_SVG from "../images/AFRICA.svg";
import ANTARTICA_SVG from "../images/ANTARTICA.svg";
import ASIA_SVG from "../images/ASIA.svg";
import OCEANIA_SVG from "../images/OCEANIA.svg";
import EUROPE_SVG from "../images/EUROPE.svg";
import NORTH_AMERICA_SVG from "../images/NORTH_AMERICA.svg";
import SOUTH_AMERICA_SVG from "../images/SOUTH_AMERICA.svg";

function ContinentSvg({ code, className }) {
    if (code === "AF") {
        return (
            <div className={className}>
                <img src={AFRICA_SVG} alt="Africa Continent SVG" />
            </div>
        );
    }
    
    if (code === "AN") {
        return (
            <div className={className}>
                <img src={ANTARTICA_SVG} alt="Antartica Continent SVG (Rudolph)" />
            </div>
        );
    }
    
    if (code === "AS") {
        return (
            <div className={className}>
                <img src={ASIA_SVG} alt="Asia Continent SVG" />
            </div>
        );
    }
    
    if (code === "OC") {
        return (
            <div className={className}>
                <img src={OCEANIA_SVG} alt="Oceania Continent SVG" />
            </div>
        );
    }
    
    if (code === "EU") {
        return (
            <div className={className}>
                <img src={EUROPE_SVG} alt="Europe Continent SVG" />
            </div>
        );
    }
    
    if (code === "NA") {
        return (
            <div className={className}>
                <img src={NORTH_AMERICA_SVG} alt="North America Continent SVG" />
            </div>
        );
    }
    
    if (code === "SA") {
        return (
            <div className="w-5 h-5 absolute right-[-26px] top-[-2px] ">
                <img src={SOUTH_AMERICA_SVG} alt="South America Continent SVG (Alpca)" />
            </div>
        );
    }
}

export default ContinentSvg;

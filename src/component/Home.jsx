import React from "react";
import backgroundImage from "../images/pascal-meier-UYiesSO4FiM-unsplash.jpg";
import HomeHeroSection from "./HomeHeroSection";

function Home() {
    return (
        <div className="">
            <HomeHeroSection backgroundImage={backgroundImage} />
            <div className="text-red-600 bottom-0 fixed opacity-80">
                DISCLAIMER: NOT FOR REAL NAVIGATION
            </div>
        </div>
    );
}

export default Home;
 

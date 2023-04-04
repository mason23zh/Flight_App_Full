import backgroundImage from "../images/thunderstorm.jpg";
import HeroSection from "./HeroSection";
import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";

const ExtremeWeather = () => {
    const message = "Extreme weather";
    const placeHolderMessage = "Search country or continent";
    return (
        <div>
            <HeroSection backgroundImage={backgroundImage} message={message} placedHoldMessage={placeHolderMessage} />
            <ExtremeWeatherHeroSection />
        </div>
    );
};

export default ExtremeWeather;

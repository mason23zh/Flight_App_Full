import backgroundImage from "../images/thunderstorm.jpg";
import HeroSection from "./HeroSection";

const ExtremeWeather = () => {
    const message = "Extreme weather";
    const placeHolderMessage = "Search country or area";
    return <HeroSection backgroundImage={backgroundImage} message={message} placedHoldMessage={placeHolderMessage} />;
};

export default ExtremeWeather;

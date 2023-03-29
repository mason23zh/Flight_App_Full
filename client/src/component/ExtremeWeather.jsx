import backgroundImage from "../images/thunderstorm.jpg";
import HeroSection from "./HeroSection";

const ExtremeWeather = () => {
    const message = "Extreme weather";
    return <HeroSection backgroundImage={backgroundImage} message={message} />;
};

export default ExtremeWeather;

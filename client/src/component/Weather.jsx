import backgroundImage from "../images/clearsky.jpg";
import HeroSection from "./HeroSection";

const Weather = () => {
    const message = "Current weather";
    const placeHolderMessage = "Search ICAO or airport name";
    return <HeroSection backgroundImage={backgroundImage} message={message} placedHoldMessage={placeHolderMessage} />;
};

export default Weather;

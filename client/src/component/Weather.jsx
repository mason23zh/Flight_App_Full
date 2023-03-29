import backgroundImage from '../images/clearsky.jpg';
import HeroSection from "./HeroSection";

const Weather = () => {
const message = "Current weather"
    return (
        <HeroSection backgroundImage={backgroundImage} message={message}/>
    );
};

export default Weather;
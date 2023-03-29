import backgroundImage from '../images/mika-baumeister-DHlZenOMjJI-unsplash.jpg'
import HeroSection from "./HeroSection";
const Airports = () => {
    const message = "Airport information"
    
    return (
        <HeroSection backgroundImage={backgroundImage} message={message}/>
    );
};

export default Airports;
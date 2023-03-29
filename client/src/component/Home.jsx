import backgroundImage from '../images/pascal-meier-UYiesSO4FiM-unsplash.jpg'
import HomeHeroSection from "./HomeHeroSection";
const Home = () => {
    return (
       <HomeHeroSection backgroundImage={backgroundImage} message="METAR airports"/>
    );
};

export default Home;
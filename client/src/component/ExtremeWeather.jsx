import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import ExtremeWeatherHeader from "./ExtremeWeatherHeader";

const ExtremeWeather = () => {
    // userSelection {weather: ..., scope: ..., option:...}
    const onUserSelection = (userSelection) => {
        console.log(userSelection);
    };
    return (
        <>
            <div className="bg-gray-200 ">
                <ExtremeWeatherHeroSection />
                <ExtremeWeatherHeader onSelection={onUserSelection} />
            </div>
        </>
    );
};

export default ExtremeWeather;

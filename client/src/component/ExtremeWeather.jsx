import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import ExtremeWeatherHeader from "./ExtremeWeatherHeader";

const ExtremeWeather = () => {
    const onUserSelection = (userSelection) => {
        console.log(userSelection.weather);
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

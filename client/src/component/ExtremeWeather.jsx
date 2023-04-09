import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import ExtremeWeatherHeader from "./ExtremeWeatherHeader";
import { useSelector } from "react-redux";
import { useFetchMetarsForCountryQuery } from "../store";

const ExtremeWeather = () => {
    const userSelection = useSelector((state) => {
        return state.extremeWeather.userSelection;
    });
    console.log(userSelection);
    return (
        <>
            <div className="bg-gray-200 ">
                <ExtremeWeatherHeroSection />
                <ExtremeWeatherHeader />
            </div>
        </>
    );
};

export default ExtremeWeather;

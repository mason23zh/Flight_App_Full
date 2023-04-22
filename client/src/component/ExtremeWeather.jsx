import ExtremeWeatherHeroSection from "./ExtreamWeatherHeroSection";
import ExtremeWeatherHeader from "./ExtremeWeatherHeader";
import MetarDisplayList from "./MetarDisplayList";
import Table from "./Table";

const ExtremeWeather = () => {
    return (
        <>
            <div className="bg-gray-200 ">
                <ExtremeWeatherHeroSection />
                <ExtremeWeatherHeader />
            </div>
            <MetarDisplayList />
        </>
    );
};

export default ExtremeWeather;

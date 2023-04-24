import backgroundImage from "../images/thunderstorm.jpg";
import { useSelector } from "react-redux";

const ExtremeWeatherHeroSection = () => {
    const { scope } = useSelector((state) => {
        return state.extremeWeather.userSelection;
    });
    const tempScopeName = scope?.length > 0 ? scope.toLowerCase() : "Global";
    const scopeName = tempScopeName.charAt(0).toUpperCase() + tempScopeName.slice(1);
    return (
        <div className="relative">
            <div
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    height: "200px",
                    width: "auto",
                }}
            ></div>
            <div className="absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%] text-cyan-50 flex flex-col justify-center items-center">
                <h1 className="text-4xl">{scopeName} Extreme Weather</h1>
                <h2 className="text-2xl">Search for {tempScopeName} extreme weather</h2>
            </div>
        </div>
    );
};

export default ExtremeWeatherHeroSection;

import backgroundImage from "../images/thunderstorm.jpg";

const ExtremeWeatherHeroSection = () => {
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
            <div className="absolute left-[35%] top-[37%] text-cyan-50 flex flex-col justify-center items-center">
                <h1 className="text-4xl">Global Extreme Weather</h1>
                <h2 className="text-2xl">Search for global extreme weather by using the filter</h2>
            </div>
        </div>
    );
};

export default ExtremeWeatherHeroSection;

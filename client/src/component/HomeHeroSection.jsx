const HomeHeroSection = ({ backgroundImage }) => {
    return (
        <div className="relative">
            <div
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    height: "960px",
                    width: "auto",
                }}
            ></div>
            <form className="absolute top-[38%] left-[38%]">
                <div className="flex flex-col items-center justify-center gap-7">
                    <h2 className="text-white text-4xl">Get METARs, airports and more</h2>
                    <input
                        className="rounded-xl border-2 w-full h-10"
                        placeholder="Search ICAO code, airport name, city..."
                    />
                    <button className="px-3 py-1 text-white border-white border-2 rounded-xl text-xl">Get Data</button>
                </div>
            </form>
        </div>
    );
};

export default HomeHeroSection;

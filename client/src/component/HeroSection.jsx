const HeroSection = ({backgroundImage, message}) => {
    return (
        <div className="relative">
            <div style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition:'center',
                height: "200px",
                width:"auto",
            }}>
            </div>
            <h2 className="absolute text-white text-4xl top-[44%] left-[44%]" >{message}</h2>
        </div>
    );
};

export default HeroSection;
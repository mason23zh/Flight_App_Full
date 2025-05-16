const FlightProgressBar = ({ progress }) => {
    return (
        <div className="relative w-full bg-gray-200 rounded-full h-6 dark:bg-gray-700">
            <div
                className="bg-green-500 h-full rounded-full transition-all ease-linear duration-150"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

export default FlightProgressBar;

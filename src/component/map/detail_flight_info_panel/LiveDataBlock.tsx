const LiveDataBlock = ({ altitude, groundspeed, toGoDistance }) => {
    return (
        <div className="grid grid-cols-3 bg-gray-400 text-[15px] md:text-lg text-gray-800">
            <div className="flex flex-col items-center">
                <div>Speed</div>
                <div>{groundspeed} kt</div>
            </div>
            <div className="flex flex-col items-center">
                <div>Altitude</div>
                <div>{altitude} ft</div>
            </div>
            <div className="flex flex-col items-center">
                <div>To Go</div>
                <div>{toGoDistance !== -1 ? toGoDistance : "N/A"} nm</div>
            </div>
        </div>
    );
};

export default LiveDataBlock;

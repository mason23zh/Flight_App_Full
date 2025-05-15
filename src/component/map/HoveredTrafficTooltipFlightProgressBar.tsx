
interface HoveredTrafficTooltipFlightProgressBarProps {
    progress: number;
}

const HoveredTrafficTooltipFlightProgressBar = ({ progress }: HoveredTrafficTooltipFlightProgressBarProps) => {
    return (
        <div className="relative h-1 bg-gray-600 rounded-full overflow-hidden">
            <div
                className="absolute left-0 top-0 h-full bg-green-500"
                style={{
                    width: `${progress}%`,
                }}
            ></div>
        </div>
    );
};

export default HoveredTrafficTooltipFlightProgressBar;
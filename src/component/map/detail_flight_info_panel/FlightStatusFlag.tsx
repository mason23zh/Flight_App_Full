import { useEffect, useState } from "react";

const FlightStatusFlag = ({ progress }) => {
    const [status, setStatus] = useState("");
    useEffect(() => {
        if (progress === 0) {
            setStatus("On Ground");
        } else if (progress === -1) {
            setStatus("No Flight Plan");
        } else if (progress > 0 && progress <= 5) {
            setStatus("Departure");
        } else if (progress > 5 && progress <= 90) {
            setStatus("Enroute");
        } else {
            setStatus("Arrival");
        }
    }, [progress]);

    return (
        <div className="absolute top-0 right-0 rounded-bl-md
        bg-blue-400 px-3 text-md font-bold">
            {status}
        </div>
    );
};

export default FlightStatusFlag;
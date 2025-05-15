import { useEffect, useState } from "react";
import moment from "moment";


function TimeSection() {
    const [today, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    });

    return (
        <div className="grid grid-cols-1 text-xs md:text-sm">
            <div>
                {moment(today)
                    .utc()
                    .format("D MMM HH:mm")} UTC
            </div>
            <div>
                {moment(today)
                    .format("D MMM HH:mm")} Local
            </div>
        </div>
    );
}

export default TimeSection;
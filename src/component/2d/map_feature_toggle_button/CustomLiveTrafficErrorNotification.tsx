import React, { useEffect, useState } from "react";
import { PiWarningCircle } from "react-icons/pi";

import { IoCloseCircle } from "react-icons/io5";
import { Timer } from "../../../util/Timer";

interface Props {
    onAutoClose: () => void;
    onManualClose: () => void;
    autoCloseTime: number;
}

const CustomLiveTrafficErrorNotification = ({
    onAutoClose,
    onManualClose,
    autoCloseTime
}: Props) => {
    const [timer, setTimer] = useState<Timer | null>(null);
    const oscLink = "https://github.com/mason23zh/Orion-Sim-Connector-OSC/releases/tag/Version-0.3";


    useEffect(() => {
        const newTimer = new Timer(() => onAutoClose(), autoCloseTime);
        setTimer(newTimer);

        return () => {
            if (timer) timer.clearTimeout();
        };
    }, [onAutoClose]);

    const handleMouseEnter = () => {
        if (timer) {
            timer.pause();
        }
    };

    const handleMouseLeave = () => {
        if (timer) {
            timer.resume();
        }
    };

    const notificationClass = "fixed bottom-[20px] left-1/2 transform -translate-x-1/2 " +
            "bg-purple-200 p-2 rounded";

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className={notificationClass}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="flex items-center justify-center gap-3 text-sm font-Rubik"
            >
                <div className="text-red-700">
                    <PiWarningCircle size={20}/>
                </div>
                <div>
                    Could not connect to simulator, make sure OSC is running. <br/>
                    To learn more about OSC&nbsp;
                    <a
                        href={oscLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-solid">
                        here
                    </a>
                </div>
                <div
                    className="self-start hover:cursor-pointer hover:text-gray-800"
                    onClick={onManualClose}
                >
                    <IoCloseCircle size={20}/>
                </div>
            </div>
        </div>
    );
};

export default CustomLiveTrafficErrorNotification;
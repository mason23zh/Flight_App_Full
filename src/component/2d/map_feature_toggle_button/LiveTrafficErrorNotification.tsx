import React, { useEffect, useState } from "react";
import { useWebSocketContext } from "../WebSocketContext";
import { CustomProvider, Notification } from "rsuite";
import { Timer } from "../../../util/Timer";


interface Props {
    autoCloseTime: number;
}

const LiveTrafficErrorNotification = ({ autoCloseTime }: Props) => {
    const oscLink = "https://github.com/mason23zh/Orion-Sim-Connector-OSC/releases/tag/Version-0.3";

    const [notification, setNotification] = useState(false);
    const [timer, setTimer] = useState<Timer | null>(null);

    const { connectionStatus } = useWebSocketContext();

    useEffect(() => {
        if (connectionStatus === "failed") {
            setNotification(true);
            const newTimer = new Timer(() => setNotification(false), autoCloseTime);
            setTimer(newTimer);
        }
    }, [connectionStatus]);


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

    return (
        <>{(notification) &&
            <CustomProvider theme="light">
                <div
                    className="fixed bottom-[20px] left-1/2 transform -translate-x-1/2"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >

                    <Notification
                        type="error"
                        closable
                        className="bg-red-200 whitespace-nowrap text-sm text-gray-900"
                    >
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
                    </Notification>
                </div>
            </CustomProvider>
        }
        </>
    );
};

export default LiveTrafficErrorNotification;
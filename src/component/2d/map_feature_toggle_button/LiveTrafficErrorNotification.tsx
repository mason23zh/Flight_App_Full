import React, { useCallback, useEffect, useState } from "react";
import { useWebSocketContext } from "../WebSocketContext";
import { CustomProvider, Notification } from "rsuite";
import { Timer } from "../../../util/Timer";

type ConnectionStatus = "connected" | "disconnected" | "connecting" | "failed";

interface Props {
    autoCloseTime: number;
    closeNotification: () => void;
}

const LiveTrafficErrorNotification = ({
    autoCloseTime,
    closeNotification
}: Props) => {
    console.log("live traffic error notification run.");
    const oscLink = "https://github.com/mason23zh/Orion-Sim-Connector-OSC/releases/tag/Version-0.3";

    const [notification, setNotification] = useState(false);
    // Manually control the closing of the Notification
    const [timer, setTimer] = useState<Timer | null>(null);

    // console.log("connection status:", connectionStatus);


    const {
        // connectionStatus,
        closeWebSocket,
    } = useWebSocketContext();

    useEffect(() => {
        // if (connectionStatus === "failed") {
        setNotification(true);
        const newTimer = new Timer(() => setNotification(false), autoCloseTime);
        setTimer(newTimer);

        return () => {
            if (timer) timer.clearTimeout();
        };
        // }
    }, [closeNotification, autoCloseTime]);


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

    const handleNotificationClose = useCallback(() => {
        closeNotification();  // Close the notification via the parent function
        closeWebSocket();     // Close WebSocket when notification is manually closed
    }, [closeWebSocket, closeNotification]);

    // const handleNotificationClose = useCallback(() => {
    //     setNotification(false);
    //     closeWebSocket();
    // }, []);

    return (
    // <>{(notification) &&
        <CustomProvider theme="light">
            <div
                className="fixed bottom-[20px] left-1/2 transform -translate-x-1/2"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >

                <Notification
                    closable
                    className="bg-red-300 whitespace-nowrap text-sm text-black font-Rubik pr-2"
                    onClose={handleNotificationClose}
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
    // }
    // </>
    );
};

export default React.memo(LiveTrafficErrorNotification);
import React, { useEffect, useState } from "react";
import { useWebSocketContext } from "../WebSocketContext";
import { CustomProvider, Notification } from "rsuite";
import { PiWarningCircle } from "react-icons/pi";


interface Props {
    autoCloseTime: number;
}

const LiveTrafficErrorNotification = ({ autoCloseTime }: Props) => {
    const oscLink = "https://github.com/mason23zh/Orion-Sim-Connector-OSC/releases/tag/Version-0.3";

    const [notification, setNotification] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const { connectionStatus } = useWebSocketContext();

    useEffect(() => {
        if (connectionStatus === "failed") {
            setNotification(true);
        }
    }, [connectionStatus]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (notification && !isHovered) {
            timer = setTimeout(() => {
                setNotification(false);
            }, autoCloseTime);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [notification, isHovered]);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    // const handleCloseNotification = () => {
    //     setNotification(false);
    // };


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
                            <div>
                                Could not connect to simulator, make sure OSC is running. <br/>
                                To learn more about OSC&nbsp;
                                <a
                                    href={oscLink}
                                    target="_blank"
                                    className="underline decoration-solid" rel="noreferrer">
                                    here
                                </a>
                            </div>
                        </div>
                    </Notification>
                </div>
            </CustomProvider>
        }
        </>
    );
};

export default LiveTrafficErrorNotification;
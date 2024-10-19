import React, { useEffect, useState } from "react";
import { useWebSocketContext } from "../WebSocketContext";
import { set } from "lodash";

interface Props {
    autoCloseTime: number;
}

const LiveTrafficErrorNotification = ({ autoCloseTime }: Props) => {
    console.log("Notification run.");
    const [notification, setNotification] = useState(false);


    const { connectionStatus } = useWebSocketContext();

    console.log("Connection status:", connectionStatus);

    useEffect(() => {
        if (connectionStatus === "failed") {
            setNotification(true);
        }
    }, [connectionStatus]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setNotification(false);
        }, autoCloseTime);

        return () => {
            clearTimeout(timer);
        };
    }, [notification]);

    const handleCloseNotification = () => {
        setNotification(false);
    };


    return (
        <>{(notification) &&
            <div
                className="fixed bottom-[20px] left-1/2 z-50 w-auto bg-red-500 transform -translate-x-1/2"
            >
                <div className="m-1">
                    <div
                        className="bg-black text-white p-2 rounded-md animate-fade"
                        onClick={handleCloseNotification}
                    >
                        Could not connect to simulator, make sure OSC is running. To lear more about OSC here.
                    </div>
                </div>
            </div>
        }
        </>
    );
};

export default LiveTrafficErrorNotification;
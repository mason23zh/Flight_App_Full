import React, { useState, useEffect } from "react";
import { MdNavigation } from "react-icons/md"; // Use any icon you prefer
import { useWebSocketContext } from "../WebSocketContext";
import { useDispatch } from "react-redux";
import { toggleMovingMap } from "../../../store";
import { Tooltip } from "react-tooltip";
import LiveTrafficErrorNotification from "./LiveTrafficErrorNotification";

interface Props {
    isTouchScreen: boolean;
}

//TODO: Add notification if connection is failed or un-available.
const LiveTrafficToggleButton = ({ isTouchScreen }: Props) => {
    const {
        openWebSocket,
        closeWebSocket,
        connectionStatus
    } = useWebSocketContext();
    const [isActive, setIsActive] = useState(false); // Track button's active state
    const [notification, setNotification] = useState<boolean>(false);
    const dispatch = useDispatch();


    const activeClass = isTouchScreen ?
        "bg-blue-500 px-2 py-1 items-center rounded-lg" :
        "bg-blue-500 px-2 py-1 items-center rounded-lg hover:bg-blue-400";
    const inActiveClass = isTouchScreen ?
        "bg-gray-500 px-2 py-1 items-center rounded-lg" :
        "bg-gray-500 px-2 py-1 items-center rounded-lg hover:bg-gray-400";

    const tooltipMessage = "Enable moving map";

    const handleToggle = () => {
        const localActiveState = !isActive;
        setIsActive(prev => !prev);
        if (localActiveState) {
            openWebSocket();
        } else {
            closeWebSocket();
        }
    };

    useEffect(() => {
        if (!isActive) {
            closeWebSocket();
        }


        // console.log("Notification.", connectionStatus);

        if (connectionStatus === "failed") {
            setNotification(true);
        }

        if (connectionStatus === "disconnected" || connectionStatus === "failed") {
            closeWebSocket();
            setIsActive(false);
            dispatch(toggleMovingMap(false));
        }

        if (connectionStatus === "connected" && isActive) {
            dispatch(toggleMovingMap(true));
        }
    }, [connectionStatus, isActive, dispatch, closeWebSocket]);


    return (
        <div
            className="relative"
            onClick={handleToggle}
        >
            <button
                id="nav-button"
                className={isActive ? activeClass : inActiveClass}
            >
                <MdNavigation className="text-xl text-white"/>
            </button>

            {!isTouchScreen &&
                <Tooltip
                    anchorSelect="#nav-button"
                    delayShow={300}
                    style={{
                        backgroundColor: "rgb(0,0,0)",
                        color: "rgb(255,255,255)",
                        fontSize: "13px",
                        padding: "5px",
                        borderRadius: "5px"
                    }}
                >
                    {tooltipMessage}
                </Tooltip>
            }

            {notification &&
                <LiveTrafficErrorNotification autoCloseTime={3000}/>
            }

        </div>
    );
};

export default React.memo(LiveTrafficToggleButton);
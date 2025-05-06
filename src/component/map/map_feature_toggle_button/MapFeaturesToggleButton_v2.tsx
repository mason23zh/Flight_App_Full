import React, { useState } from "react";
import { Tooltip } from "react-tooltip";

interface Props {
    onToggle: () => void;
    icon: React.ReactElement;
    initialActive: boolean;
    tooltipMessage: string;
    isTouchScreen: boolean;
    buttonId: string;
}

const MapFeaturesToggleButton_v2 = ({
    onToggle,
    icon,
    initialActive,
    tooltipMessage,
    isTouchScreen,
    buttonId
}: Props) => {
    const iconClass = "text-white text-xl";
    const activeClass = isTouchScreen
        ? "bg-blue-500 px-2 py-1 items-center rounded-lg"
        : "bg-blue-500 px-2 py-1 items-center rounded-lg hover:bg-blue-400";
    const inActiveClass = isTouchScreen
        ? "bg-gray-500 px-2 py-1 items-center rounded-lg"
        : "bg-gray-500 px-2 py-1 items-center rounded-lg hover:bg-gray-400";

    const [showTooltip, setShowTooltip] = useState(false);

    const activeButtonClass = initialActive ? activeClass : inActiveClass;

    console.log("INITIAL ACTIVE STATE:", initialActive);

    const handleClick = () => {
        onToggle();
    };


    return (
        <>
            <button
                id={buttonId}
                className={activeButtonClass}
                onClick={handleClick}
                onMouseEnter={() => setShowTooltip(false)}
                onMouseLeave={() => setShowTooltip(true)}
            >
                {React.cloneElement(icon, { className: iconClass })}
            </button>
            {!isTouchScreen && (
                <Tooltip
                    hidden={showTooltip}
                    anchorSelect={`#${buttonId}`}
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
            )}
        </>
    );
};

export default MapFeaturesToggleButton_v2;

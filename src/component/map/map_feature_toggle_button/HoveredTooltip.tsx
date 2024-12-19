import React from "react";

interface Props {
    visible: boolean;
    message: string;
    mousePosition: { x: number; y: number };
    isTouchScreen: boolean;
}

const HoveredTooltip = ({
    visible,
    message,
    mousePosition,
    isTouchScreen
}: Props) => {
    if (!visible || isTouchScreen) return null;

    const tooltipStyle = "fixed px-2 py-1 bg-black text-white " +
            "text-xs rounded-md pointer-events-none z-40";

    return (
        <div
            className={tooltipStyle}
            style={{
                top: mousePosition.y + 15,
                left: mousePosition.x + 15,
            }}
        >
            {message}
        </div>
    );
};

export default HoveredTooltip;
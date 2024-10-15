import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type TooltipContextType = {
    showTooltip: (message: string) => void;
    hideTooltip: () => void;
}

const TooltipContext = createContext<TooltipContextType | null>(null);

export const useTooltip = () => {
    return useContext(TooltipContext);
};

const TooltipProvider = ({ children }) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState("");
    const [mousePosition, setMousePosition] = useState({
        x: 0,
        y: 0
    });

    // Memoize showTooltip and hideTooltip to prevent re-creation on each render
    const showTooltip = useCallback((message: string) => {
        setTooltipMessage(message);
        setTooltipVisible(true);
    }, []);

    const hideTooltip = useCallback(() => {
        setTooltipVisible(false);
    }, []);

    // Track mouse movement only when tooltip is visible
    useEffect(() => {
        if (!tooltipVisible) return;

        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({
                x: event.clientX,
                y: event.clientY,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [tooltipVisible]);

    return (
        <TooltipContext.Provider value={{
            showTooltip,
            hideTooltip,
            mousePosition,
            tooltipVisible
        }}>
            {children}

            {tooltipVisible && (
                <div
                    className="fixed px-2 py-1 bg-black text-white text-xs rounded-md pointer-events-none z-40"
                    style={{
                        top: mousePosition.y + 5,
                        left: mousePosition.x + 10,
                    }}
                >
                    {tooltipMessage}
                </div>
            )}
        </TooltipContext.Provider>
    );
};

export default TooltipProvider;
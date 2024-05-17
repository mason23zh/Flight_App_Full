import React, { useCallback, useRef, useState } from "react";

interface MousePosition {
    x: number;
    y: number;
}

interface UseDisplayToolTip {
    tooltipVisible: boolean;
    mousePosition: MousePosition;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    handleMouseMove: (e: React.MouseEvent) => void;
}

const useDisplayTooltip = (delay: number = 300): UseDisplayToolTip => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState<MousePosition>({
        x: 0,
        y: 0
    });
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = useCallback(() => {
        timerRef.current = setTimeout(() => {
            setTooltipVisible(true);
        }, delay);
    }, [delay]);

    const handleMouseLeave = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setTooltipVisible(false);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        setMousePosition({
            x: e.clientX,
            y: e.clientY
        });
    }, []);

    return {
        tooltipVisible,
        mousePosition,
        handleMouseEnter,
        handleMouseLeave,
        handleMouseMove,
    };
};

export default useDisplayTooltip;

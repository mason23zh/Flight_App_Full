import { useMemo } from "react";

const useIsTouchScreen = () => {
    return useMemo(() => {
        return "ontouchstart" in window ||
                navigator.maxTouchPoints > 0;
    }, []);
};

export default useIsTouchScreen;
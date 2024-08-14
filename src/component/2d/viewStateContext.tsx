import React, { createContext, useContext } from "react";

interface Viewport {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
    width: number;
    height: number;
    isDragging: boolean;//to track mouse dragging state
}

// Create a Context for the viewState
const ViewStateContext = createContext<Viewport | undefined>(undefined);

// Custom hook to use the viewState context
export const useViewState = () => {
    const context = useContext(ViewStateContext);
    if (!context) {
        throw new Error("useViewState must be used within a ViewStateProvider");
    }
    return context;
};


export const ViewStateProvider: React.FC<{ value: Viewport; children: React.ReactNode }> = ({
    value,
    children
}) => {
    return (
        <ViewStateContext.Provider value={value}>
            {children}
        </ViewStateContext.Provider>
    );
};
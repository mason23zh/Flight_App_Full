import { MapRef } from "react-map-gl";
import React, { createContext, MutableRefObject, useCallback, useContext, useEffect, useState } from "react";

export interface ExtendedMapRef extends MapRef {
    screenHeight?: number;
    screenWidth?: number;
    isDragging?: boolean;
}


type MapContextType = {
    mapRef: MutableRefObject<ExtendedMapRef | null>;
    bounds: [number, number, number, number] | null;
    updateBounds: (bounds: [number, number, number, number]) => void;
};

// const MapContext = createContext<MapContextType | null>(null);
const MapRefContext = createContext<MapContextType | null>(null);


export const useMapRefContext = (): MapContextType => {
    const context = useContext(MapRefContext);
    if (!context) {
        throw new Error("useMapContext must be used within MapProvider");
    }
    const {
        mapRef,
        bounds,
        updateBounds
    } = context;
    return {
        mapRef,
        bounds,
        updateBounds
    };
};


export const MapRefProvider: React.FC<{
    value: MutableRefObject<ExtendedMapRef | null>;
    children: React.ReactNode
}> = ({
    value,
    children
}) => {
    const mapRef = value;
    const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);
    const updateBounds = useCallback((newBounds: [number, number, number, number]) => {
        setBounds(newBounds);
    }, []);

    useEffect(() => {
        const updateDimensions = () => {
            if (mapRef.current) {
                const mapElement = document.getElementById("mainMap");
                mapRef.current.screenHeight = mapElement?.clientHeight || 0;
                mapRef.current.screenWidth = mapElement?.clientWidth || 0;
            }
        };

        // Initial dimensions update
        updateDimensions();

        // Update dimensions on window resize
        window.addEventListener("resize", updateDimensions);

        // Cleanup
        return () => {
            window.removeEventListener("resize", updateDimensions);
        };
    }, []);

    if (mapRef.current) {
        console.log("Map initialized::", mapRef.current);
        mapRef.current.isDragging = false;
    } else {
        console.log("failed");
    }

    return (
        <MapRefContext.Provider value={{
            mapRef,
            bounds,
            updateBounds
        }}>
            {children}
        </MapRefContext.Provider>
    );
};
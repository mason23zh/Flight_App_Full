import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue?: T) {
    const getItem = () => {
        const storedItem = localStorage.getItem(key);
        if (storedItem) {
            try {
                return JSON.parse(storedItem) as T;
            } catch (e) {
                console.error("Error parsing localStorage item:", e);
            }
        }
        return initialValue;
    };

    const [state, setState] = useState<T>(getItem);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key) {
                try {
                    setState(event.newValue ? JSON.parse(event.newValue) as T : initialValue);
                } catch (e) {
                    console.error("Error parsing localStorage item in event:", e);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        window.dispatchEvent(new Event("storage"));

        // Cleanup
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [key, initialValue]); // Dependency on key and initialValue

    function setStorage(item: T) {
        try {
            const itemToStore = item instanceof Function ? item(state) : item;
            setState(itemToStore);
            localStorage.setItem(key, JSON.stringify(itemToStore));
        } catch (e) {
            console.error("Error setting localStorage item:", e);
        }
    }

    return [state, setStorage] as const;
}
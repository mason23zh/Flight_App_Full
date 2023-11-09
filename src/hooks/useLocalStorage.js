import { useState } from "react";

export function useLocalStorage(key) {
    const [state, setState] = useState(JSON.parse(localStorage.getItem(key)));
    
    function setStorage(item) {
        localStorage.setItem(key, item);
        setState(item);
    }
    
    return [state, setStorage];
}

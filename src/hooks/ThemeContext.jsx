import React, { useContext, useEffect, useState } from "react";

const ThemeContext = React.createContext();
const ThemeUpdateContext = React.createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

export function useThemeUpdate() {
    return useContext(ThemeUpdateContext);
}

export function ThemeProvider({ children }) {
    const [darkTheme, setDarkTheme] = useState(false);
    
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    function toggleTheme() {
        setDarkTheme((prevDarkTheme) => !prevDarkTheme);
        if (darkTheme) {
            localStorage.setItem("themeDark", "false");
        } else {
            localStorage.setItem("themeDark", "true");
        }
    }
    
    // sync the localStorage with useContext state
    useEffect(() => {
        if (localStorage.themeDark) {
            if (localStorage.themeDark === "true") {
                setDarkTheme(true);
            } else if (localStorage.themeDark === "false") {
                setDarkTheme(false);
            }
        }
    }, []);
    
    return (
        <ThemeContext.Provider value={darkTheme}>
            {/* eslint-disable-next-line react/jsx-no-bind */}
            <ThemeUpdateContext.Provider value={toggleTheme}>
                {children}
            </ThemeUpdateContext.Provider>
        </ThemeContext.Provider>
    );
}

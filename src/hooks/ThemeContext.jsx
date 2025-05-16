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

    const onSelectMode = (mode) => {
        // Only change the theme by browsers theme if user have not selected any theme
        if (mode === "dark") {
            if (!localStorage.getItem("themeDark")) {
                setDarkTheme(true);
                localStorage.setItem("themeDark", "true");
            }
        } else if (!localStorage.getItem("themeDark")) {
            setDarkTheme(false);
            localStorage.setItem("themeDark", "false");
        }
    };

    useEffect(() => {
        // Add listener to update styles
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e) => onSelectMode(e.matches ? "dark" : "light"));

        // Setup dark/light mode for the first time
        onSelectMode(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

        // Remove listener
        return () => {
            window
                .matchMedia("(prefers-color-scheme: dark)")
                .removeEventListener("change", () => {});
        };
    }, []);

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

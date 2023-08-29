import React from "react";
import { CustomProvider } from "rsuite";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";


function About() {
    const darkMode = useTheme();
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div className="h-screen">
                <div className="flex flex-col items-center mt-10">
                    <div>
                        beta version 0.2.2
                    </div>
                    <div>
                        Logo designed by: Charlie Wang
                    </div>
                    <div>
                        <Link
                            to="/changelog"
                        >
                            Change Log
                        </Link>
                    </div>
                </div>
            </div>
        </CustomProvider>
    );
}

export default About;

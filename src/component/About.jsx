import React from "react";
import { CustomProvider } from "rsuite";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";


function About() {
    function Mailto({
        email, subject = "", body = "", children,
    }) {
        let params = subject || body ? "?" : "";
        if (subject) params += `subject=${encodeURIComponent(subject)}`;
        if (body) params += `${subject ? "&" : ""}body=${encodeURIComponent(body)}`;
        
        return <a className="hover:no-underline" href={`mailto:${email}${params}`}>{children}</a>;
    }
    
    const darkMode = useTheme();
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div className="h-screen">
                <div className="flex flex-col items-center justify-center p-3 min-h-[70vh]">
                    <div className="text-xl grid grid-cols-1 gap-2 md:text-2xl lg:text-4xl">
                        <div>
                            We&apos;d Love to Hear From You
                        </div>
                        <Mailto email="contact@airportweather.org">
                            contact@airportweather.org
                        </Mailto>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center p-3">
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

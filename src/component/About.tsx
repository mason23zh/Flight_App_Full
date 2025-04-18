import React from "react";
import { CustomProvider } from "rsuite";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";
import { Helmet } from "react-helmet-async";

function About() {
    function Mailto({ email, subject = "", body = "", children }) {
        let params = subject || body ? "?" : "";
        if (subject) params += `subject=${encodeURIComponent(subject)}`;
        if (body) params += `${subject ? "&" : ""}body=${encodeURIComponent(body)}`;

        return (
            <a className="hover:no-underline" href={`mailto:${email}${params}`}>
                {children}
            </a>
        );
    }

    const darkMode = useTheme();
    return (
        <>
            <Helmet>
                <title>About Page</title>
                <meta
                    name="description"
                    content="Learn more about our platform, designed to provide real-time weather updates, VATSIM traffic insights, and detailed airport information. Discover our mission to support aviation enthusiasts with accurate, user-friendly tools for flight planning and virtual flying"
                />
                <meta
                    name="keyword"
                    content="about page, VATSIM, virtual aviation tool, airport information, aviation enthusiasts, About Airport Weather"
                />
                <link rel="canonical" href="https://airportweather.org/about" />
            </Helmet>
            <CustomProvider theme={darkMode ? "dark" : "light"}>
                <div className="h-auto">
                    <div className="flex flex-col items-center justify-center p-3 min-h-[70vh]">
                        <div className="text-xl grid grid-cols-1 gap-2 md:text-2xl lg:text-4xl">
                            <div>We&apos;d Love to Hear From You</div>
                            <Mailto email="contact@airportweather.org">contact@airportweather.org</Mailto>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3">
                        <div>Logo designed by: Charlie Wang</div>
                        <div>
                            <Link to="/changelog">Change Log</Link>
                        </div>
                    </div>
                </div>
            </CustomProvider>
        </>
    );
}

export default About;

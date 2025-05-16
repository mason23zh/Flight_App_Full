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
                <title>About Airport Weather | VATSIM Map, METARs & Flight Tools</title>
                <meta
                    name="description"
                    content="Learn about Airport Weather — a platform for virtual pilots to explore real-time METARs, VATSIM traffic, airport data, and advanced map tools for flight simulation."
                />
                <link rel="canonical" href="https://airportweather.org/about" />
            </Helmet>
            <CustomProvider theme={darkMode ? "dark" : "light"}>
                <div className="h-auto">
                    <div className="flex flex-col items-center justify-center p-3 min-h-[70vh]">
                        <div className="text-xl grid grid-cols-1 gap-2 md:text-2xl lg:text-4xl">
                            <div>We&apos;d Love to Hear From You</div>
                            <Mailto email="contact@airportweather.org">
                                contact@airportweather.org
                            </Mailto>
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

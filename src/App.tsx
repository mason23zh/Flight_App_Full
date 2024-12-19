import "./styles.css";
import { Route, Routes } from "react-router-dom";
import { useTheme } from "./hooks/ThemeContext";
import React, { lazy, Suspense } from "react";
import Home from "./component/Home";
import About from "./component/About";
import NoMatch from "./component/NoMatch";
import Layout from "./component/Layout";
import Weather from "./component/Weather";
import ScrollToTop from "./component/ScrollToTop";
import GeneralLoading from "./component/GeneralLoading";
import FlightTracker from "./component/FlightTracker";
// import { WebSocketProvider } from "./component/map/WebSocketContext";
import { WebSocketProvider } from "./component/map/WebSocketContext";
import { HelmetProvider } from "react-helmet-async";

const Orion = lazy(() => import("./component/Orion"));
const Puzzles = lazy(() => import("./component/Puzzles"));
const MainMap = lazy(() => import("./component/map/mapbox_Layer/MainMap"));
const ExtremeWeather = lazy(() => import("./component/ExtremeWeather"));
const Airports = lazy(() => import("./component/Airports"));
const AirportDetail = lazy(() => import("./component/AirportDetail"));
const ChangeLog = lazy(() => import("./component/ChangeLog"));
const VatsimEventsAll = lazy(() => import("./component/VatsimEventsAll"));
const VatsimEventDetail = lazy(() => import("./component/VatsimEventDetail"));

function App() {
    const darkMode = useTheme();
    const themeMode = darkMode ? "dark" : "light";
    return (
        <ScrollToTop>
            <HelmetProvider>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Home/>}/>
                        <Route path="about" element={<About/>}/>
                        <Route path="weather" element={<Weather/>}/>
                        <Route path="flightTracker" element={<FlightTracker/>}/>
                        <Route path="*" element={<NoMatch/>}/>

                        {/* Lazy loaded routes */}
                        <Route path="extreme-weather" element={
                            <Suspense fallback={<GeneralLoading themeMode={themeMode}/>}>
                                <ExtremeWeather/>
                            </Suspense>
                        }/>
                        <Route path="airport" element={
                            <Suspense fallback={<GeneralLoading themeMode={themeMode}/>}>
                                <Airports/>
                            </Suspense>
                        }/>
                        <Route path="airport/detail/:icao" element={
                            <Suspense fallback={<GeneralLoading themeMode={themeMode}/>}>
                                <AirportDetail/>
                            </Suspense>
                        }/>
                        <Route path="changelog" element={
                            <Suspense fallback={<GeneralLoading themeMode={themeMode}/>}>
                                <ChangeLog/>
                            </Suspense>
                        }/>
                        <Route path="vatsim/events" element={
                            <Suspense fallback={<GeneralLoading themeMode={themeMode}/>}>
                                <VatsimEventsAll/>
                            </Suspense>
                        }/>
                        <Route path="vatsim/events/:name" element={
                            <Suspense fallback={<GeneralLoading themeMode={themeMode}/>}>
                                <VatsimEventDetail onlyDetail/>
                            </Suspense>
                        }/>

                        <Route path="Orion9600" element={
                            <Suspense fallback={<GeneralLoading themeMode={themeMode}/>}>
                                <Orion/>
                            </Suspense>
                        }/>
                        <Route path="puzzles" element={
                            <Suspense fallback={<GeneralLoading themeMode={themeMode}/>}>
                                <Puzzles/>
                            </Suspense>
                        }/>

                        <Route path="map" element={
                            <Suspense fallback={<GeneralLoading themeMode={themeMode}/>}>
                                <WebSocketProvider>
                                    <MainMap/>
                                </WebSocketProvider>
                            </Suspense>
                        }/>

                    </Route>
                </Routes>
            </HelmetProvider>
        </ScrollToTop>
    );
}

export default App;

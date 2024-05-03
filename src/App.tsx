import { Route, Routes } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import Home from "./component/Home";
import About from "./component/About";
import NoMatch from "./component/NoMatch";
import Layout from "./component/Layout";
import Airports from "./component/Airports";
import Weather from "./component/Weather";
import ExtremeWeather from "./component/ExtremeWeather";
import ChangeLog from "./component/ChangeLog";
import AirportDetail from "./component/AirportDetail";
import ScrollToTop from "./component/ScrollToTop";
import VatsimEventsAll from "./component/VatsimEventsAll";
import VatsimEventDetail from "./component/VatsimEventDetail";

const Orion = lazy(() => import("./component/Orion"));
const Puzzles = lazy(() => import("./component/Puzzles"));
const MainMap = lazy(() => import("./component/2d/mapbox_Layer/MainMap"));


function App() {
    return (
        <ScrollToTop>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="about" element={<About/>}/>
                    <Route path="weather" element={<Weather/>}/>
                    <Route path="extreme-weather" element={<ExtremeWeather/>}/>
                    <Route path="airport" element={<Airports/>}/>
                    <Route path="airport/detail/:icao" element={<AirportDetail/>}/>
                    <Route path="changelog" element={<ChangeLog/>}/>
                    <Route path="vatsim/events" element={<VatsimEventsAll/>}/>
                    <Route path="vatsim/events/:name" element={<VatsimEventDetail onlyDetail/>}/>
                    <Route path="*" element={<NoMatch/>}/>

                    {/*Lazy loaded routes*/}
                    <Route
                        path="Orion9600" element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <Orion/>
                            </Suspense>
                        }
                    />

                    <Route
                        path="puzzles" element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <Puzzles/>
                            </Suspense>
                        }
                    />

                    <Route
                        path="map"
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <MainMap/>
                            </Suspense>
                        }
                    />

                </Route>
            </Routes>
        </ScrollToTop>
    );
}

export default App;

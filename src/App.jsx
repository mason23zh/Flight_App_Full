import { Route, Routes } from "react-router-dom";
import React from "react";
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
import Orion from "./component/Orion";
import Puzzles from "./component/Puzzles";
import VatsimEvent from "./component/VatsimEvent";

function App() {
    return (
        <ScrollToTop>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="weather" element={<Weather />} />
                    <Route path="extreme-weather" element={<ExtremeWeather />} />
                    <Route path="airport" element={<Airports />} />
                    <Route path="airport/detail/:icao" element={<AirportDetail />} />
                    <Route path="changelog" element={<ChangeLog />} />
                    <Route path="vatsim/events/:name" element={<VatsimEvent />} />
                    <Route path="Orion9600" element={<Orion />} />
                    <Route path="puzzles" element={<Puzzles />} />
                    <Route path="*" element={<NoMatch />} />
                </Route>
            </Routes>
        </ScrollToTop>
    );
}

export default App;

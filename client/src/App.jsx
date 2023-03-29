import { useCallback, useEffect } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import Home from "./component/Home";
import About from "./component/About";
import NoMatch from "./component/NoMatch";
import Layout from "./component/Layout";
import Airports from "./component/Airports";
import Weather from "./component/Weather";
import ExtremeWeather from "./component/ExtremeWeather";

const App = () => {
    const connectTest = useCallback(async () => {
        const response = await axios.get("http://localhost:8001/api/v1/airports/all-airports");
        console.log(response.data.data.data);
        console.log(response.data.data.data.length);
        const airports = response.data.data.data;

        return response;
    }, []);

    useEffect(() => {
        connectTest().catch((e) => console.error(e));
    }, [connectTest]);

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="weather" element={<Weather />} />
                <Route path="extreme-weather" element={<ExtremeWeather />} />
                <Route path="airport" element={<Airports />} />
                <Route path="*" element={<NoMatch />} />
            </Route>
        </Routes>
    );
};

export default App;

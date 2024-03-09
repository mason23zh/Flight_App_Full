import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
// import { store } from "./store";
import { ThemeProvider } from "./hooks/ThemeContext";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";

import App from "./App";

const el = document.getElementById("root");
const root = createRoot(el);
root.render(
    <ThemeProvider>
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </ThemeProvider>,
); 

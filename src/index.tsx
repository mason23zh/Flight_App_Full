import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "./hooks/ThemeContext";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor, setRehydrationComplete } from "./store";

import App from "./App";

const el = document.getElementById("root");
const root = createRoot(el);
root.render(
    <ThemeProvider>
        <Provider store={store}>
            <PersistGate
                persistor={persistor}
                loading={null}
                onBeforeLift={() => {
                    // Make sure rehydration process is complete before render
                    store.dispatch(setRehydrationComplete());
                }}
            >
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </ThemeProvider>
);

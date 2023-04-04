import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { airportsApi } from "./apis/airportsApi";

export const store = configureStore({
    reducer: {
        [airportsApi.reducerPath]: airportsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(airportsApi.middleware);
    },
});

setupListeners(store.dispatch);

export { useFetchAirportsWithGenericInputQuery } from "./apis/airportsApi";

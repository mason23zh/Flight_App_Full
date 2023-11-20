import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import commonjs from "vite-plugin-commonjs";
import cesium from "vite-plugin-cesium";
// https://vitejs.dev/config/
export default defineConfig({
    base: "/",
    server: {
        port: 3000,
    },
    plugins: [
        react(),
        commonjs(),
        cesium(),
    ],
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import commonjs from "vite-plugin-commonjs";
// import { comlink } from "vite-plugin-comlink";
// import cesium from "vite-plugin-cesium";
// https://vitejs.dev/config/
export default defineConfig({
    base: "/",
    server: {
        port: 3000,
    },
    plugins: [react(), commonjs()],
    assetsInclude: ["**/*.gltf", "**/*.glb"],
    css: {
        postcss: {
            plugins: [
                require("postcss-import"),
                require("tailwindcss"),
                require("autoprefixer"),
                require("postcss-100vh-fix"),
            ],
        },
    },
});

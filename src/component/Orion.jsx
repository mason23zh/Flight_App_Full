import React from "react";
import PhotoAlbum from "react-photo-album";
import { CustomProvider } from "rsuite";
import photos from "../util/orionPhotos";
import { useTheme } from "../hooks/ThemeContext";

function Orion() {
    const darkMode = useTheme();
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div>
                <div className="text-center text-2xl md:text-3xl">Congrats! You found Orion!</div>
                <div className="px-8 py-5">
                    <PhotoAlbum photos={photos} layout="columns" />
                </div>
            </div>
        </CustomProvider>
    );
}

export default Orion;

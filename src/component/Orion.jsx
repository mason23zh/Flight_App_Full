/* eslint-disable import/no-unresolved,no-shadow */
import React, { useState } from "react";
import PhotoAlbum from "react-photo-album";
import { CustomProvider } from "rsuite";
import Lightbox from "react-awesome-lightbox";
import { useTheme } from "../hooks/ThemeContext";
import photos from "../util/orionPhotos";
import "react-awesome-lightbox/build/style.css";

function Orion() {
    const darkMode = useTheme();
    const [index, setIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div className="text-center text-2xl md:text-3xl">Congrats! You found Orion!</div>
            <div>
                <div className="px-8 py-5">
                    <PhotoAlbum
                        photos={photos}
                        layout="columns"
                        targetRowHeight={150}
                        onClick={({ index }) => {
                            setIndex(index);
                            setOpen(true);
                        }}
                    />
                </div>
            </div>
            {open
                        && (
                            <Lightbox
                                image={photos[index].src}
                                onClose={() => setOpen((prev) => !prev)}
                            />
                        )}
            
        </CustomProvider>
    );
}

export default Orion;

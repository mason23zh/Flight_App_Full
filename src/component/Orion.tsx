import PhotoAlbum from "react-photo-album";
import { CustomProvider } from "rsuite";
import { useTheme } from "../hooks/ThemeContext";
import { photos } from "../util/orionPhotos.js";

function Orion() {
    const darkMode = useTheme();
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div className="text-center text-2xl md:text-3xl">Congrats! You found Orion!</div>
            <div>
                <div className="px-8 py-5">
                    <PhotoAlbum photos={photos} layout="columns" targetRowHeight={150} />
                </div>
            </div>
        </CustomProvider>
    );
}

export default Orion;

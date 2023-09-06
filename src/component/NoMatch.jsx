import React from "react";
import { CustomProvider } from "rsuite";
import notFoundImg from "../images/404.png";
import { useTheme } from "../hooks/ThemeContext";

function NoMatch() {
    const darkMode = useTheme();
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div className="h-screen">
                <div className="flex flex-col items-center gap-5">
                    <div className="text-xl">404 Not Found</div>
                    <div className="h-[600px] w-[400px]">
                        <img src={notFoundImg} alt="Orion Not Found" />
                    </div>
                </div>
            </div>
        </CustomProvider>
    );
}

export default NoMatch;

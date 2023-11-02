import React from "react";
import { CustomProvider } from "rsuite";
import { useTheme } from "../hooks/ThemeContext";

function VatsimEvent() {
    const darkTheme = useTheme();
    return (
        <CustomProvider theme={darkTheme ? "dark" : "light"}>
            <div className="flex">
                <div className="p-5">
                    Main Content
                </div>
                <div className="p-5">
                    Description
                </div>
            </div>
        </CustomProvider>
    );
}

export default VatsimEvent;

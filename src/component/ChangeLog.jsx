import React from "react";
import { CustomProvider } from "rsuite";
import { useTheme } from "../hooks/ThemeContext";

function ChangeLog() {
    const darkTheme = useTheme();
    return (
        <CustomProvider theme={darkTheme ? "dark" : "light"}>
            <div className="flex flex-col items-center text-xl">
                Change Log
                <div>---</div>
                <div className="flex flex-col gap-3">
                    <div>
                        Beta 0.1 <br />
                        - Initial Release &#127881;
                    </div>
                    <div>
                        Beta 0.1.1 <br />
                        - Dark Mode initial support <br />
                        - Fix the routing bug <br />
                        - Background images size compressed <br />
                        - Fix the dark mode incorrect behavior in Weather component <br />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center text-xl mt-5">
                Known Issues
                <div>---</div>
                <div className="flex flex-col gap-3">
                    <div>
                        - Dark mode state not persistence when opening a new tab
                    </div>
                    <div>
                        - Mobile device support
                    </div>
                    <div>
                        - TAF support
                    </div>
                    <div>
                        - Arrival/Departure widget not switching to dark mode
                    </div>
                </div>
            </div>
        </CustomProvider>
    );
}

export default ChangeLog;

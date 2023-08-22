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
                    <div>
                        Beta 0.1.2 <br />
                        - Fix the dark mode persistence issue when opening the new browser tab <br />
                        - Added dark mode to NoMatch Page <br />
                        - Added disclaimer in footer <br />
                        - Improve the contrast for Get Data button <br />
                    </div>
                    <div>
                        Beta 0.2 <br />
                        - Added responsive
                        - Rewrite the Weather List
                        - Rewrite the Airport List
                        - Rewrite the AirportAccordion
                        - Rewrite the WeatherAccordion
                        - Rewrite the Navbar
                        - Rewrite the Airport Detail page
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center text-xl mt-5">
                Known Issues
                <div>---</div>
                <div className="flex flex-col gap-3">
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

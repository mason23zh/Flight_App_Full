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
                        - Added responsive <br />
                        - Added logo (By Charlie Wang) <br />
                        - Rewrite the Weather List (layout fix) <br />
                        - Rewrite the Airport List (layout fix) <br />
                        - Rewrite the AirportAccordion (layout fix) <br />
                        - Rewrite the WeatherAccordion (layout fix) <br />
                        - Fix the Extreme Weather page layout issue <br />
                        - Added Extreme Weather header dropdown for responsive design <br />
                        - Added Navbar dropdown for responsive design <br />
                        - Rewrite the Airport Detail page <br />
                    </div>
                    <div>
                        Beta 0.2.1 <br />
                        - Added margin on input bar <br />
                        - Added Footer to display disclaimer <br />
                        - Fix the Map size change in the Airport Detail page<br />
                        - Fix the width issue when screen become too small <br />
                        - Adjust the Detail Weather panel when switching to a smaller screen <br />
                        - Adjust the width for input search bar <br />
                        - Make some texts first letter capital <br />
                    </div>
                    <div>
                        Beta 0.2.2 <br />
                        - Added popular airports in the Home page <br />
                        - Added ATIS in Airport Detail page <br />
                        - Fix the issue in localStorage so the theme and airport/weather list will be persistence
                        after the refresh<br />
                        - Fix the issue when loading up a page for the first time will stucked at loading page if no
                        localStorage available <br />
                        - Fix the input bar zoom issue in IOS <br />
                        - Re-tune the Home page layout to fit smaller screen better <br />
                        - Fix the Weather input bar not trimming the user input <br />
                        - Fix the `No Results` text not being centered <br />
                    </div>
                    <div>
                        Beta 0.3 <br />
                        - Added popular Vatsim airports <br />
                        - Added visual guidance in the Home page to indicate the page could be scrolled down <br />
                        - Change display layout for popular airport in Home page <br />
                        - Fix the visited airport been counted twice issue <br />
                        - Fix the issue when page is rendering from the bottom <br />
                        - Fix the issue NotFound page might render if Airport Detail page is taking too long to
                        retrieve data <br />
                    </div>
                    <div>
                        Beta 0.3.1 <br />
                        - Added responsive to Pagination component in airport search list <br />
                        - Change airport search list to new display layout <br />
                        - Fix UI issue in Home page popular airport tab (location render twice) <br />
                    </div>
                    <div>
                        Beta 0.3.2 <br />
                        - Added Finding Orion puzzle <br />
                        - Fix No Results not centered issue in Weather List <br />
                    </div>
                    <div>
                        Beta 0.3.3 <br />
                        - Make URLs in Airport Detail page shorter <br />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center text-xl mt-5">
                Known Issues
                <div>---</div>
                <div className="flex flex-col gap-3">
                    <div>
                        - Mobile device support layout issue
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

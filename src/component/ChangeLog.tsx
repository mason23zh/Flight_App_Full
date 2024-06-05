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
                        Beta 0.1 <br/>
                        - Initial Release &#127881;
                    </div>
                    <div>
                        Beta 0.1.1 <br/>
                        - Dark Mode initial support <br/>
                        - Fix the routing bug <br/>
                        - Background images size compressed <br/>
                        - Fix the dark mode incorrect behavior in Weather component <br/>
                    </div>
                    <div>
                        Beta 0.1.2 <br/>
                        - Fix the dark mode persistence issue when opening the new browser tab <br/>
                        - Added dark mode to NoMatch Page <br/>
                        - Added disclaimer in footer <br/>
                        - Improve the contrast for Get Data button <br/>
                    </div>
                    <div>
                        Beta 0.2 <br/>
                        - Added responsive <br/>
                        - Added logo (By Charlie Wang) <br/>
                        - Rewrite the Weather List (layout fix) <br/>
                        - Rewrite the Airport List (layout fix) <br/>
                        - Rewrite the AirportAccordion (layout fix) <br/>
                        - Rewrite the WeatherAccordion (layout fix) <br/>
                        - Fix the Extreme Weather page layout issue <br/>
                        - Added Extreme Weather header dropdown for responsive design <br/>
                        - Added Navbar dropdown for responsive design <br/>
                        - Rewrite the Airport Detail page <br/>
                    </div>
                    <div>
                        Beta 0.2.1 <br/>
                        - Added margin on input bar <br/>
                        - Added Footer to display disclaimer <br/>
                        - Fix the Map size change in the Airport Detail page<br/>
                        - Fix the width issue when screen become too small <br/>
                        - Adjust the Detail Weather panel when switching to a smaller screen <br/>
                        - Adjust the width for input search bar <br/>
                        - Make some texts first letter capital <br/>
                    </div>
                    <div>
                        Beta 0.2.2 <br/>
                        - Added popular airports in the Home page <br/>
                        - Added ATIS in Airport Detail page <br/>
                        - Fix the issue in localStorage so the theme and airport/weather list will be persistence
                        after the refresh<br/>
                        - Fix the issue when loading up a page for the first time will stucked at loading page if no
                        localStorage available <br/>
                        - Fix the input bar zoom issue in IOS <br/>
                        - Re-tune the Home page layout to fit smaller screen better <br/>
                        - Fix the Weather input bar not trimming the user input <br/>
                        - Fix the `No Results` text not being centered <br/>
                    </div>
                    <div>
                        Beta 0.3 <br/>
                        - Added popular Vatsim airports <br/>
                        - Added visual guidance in the Home page to indicate the page could be scrolled down <br/>
                        - Change display layout for popular airport in Home page <br/>
                        - Fix the visited airport been counted twice issue <br/>
                        - Fix the issue when page is rendering from the bottom <br/>
                        - Fix the issue NotFound page might render if Airport Detail page is taking too long to
                        retrieve data <br/>
                    </div>
                    <div>
                        Beta 0.3.1 <br/>
                        - Added responsive to Pagination component in airport search list <br/>
                        - Change airport search list to new display layout <br/>
                        - Fix UI issue in Home page popular airport tab (location render twice) <br/>
                    </div>
                    <div>
                        Beta 0.3.2 <br/>
                        - Added Finding Orion puzzle <br/>
                        - Fix No Results not centered issue in Weather List <br/>
                    </div>
                    <div>
                        Beta 0.3.3 <br/>
                        - Added dark theme map tile in Airport Detail when switching to dark mode <br/>
                        - Added linear-gradient to home page background image <br/>
                        - Automatically detect system dark mode setting <br/>
                        - Make URLs in Airport Detail page table shorter, results a smaller table <br/>
                        - Lower the Home Page background image brightness in dark mode <br/>
                        - Change input field background color to match dark mode <br/>
                        - Change search bar layout for Home, Weather and Airport page <br/>
                        - Added Random Airport feature <br/>
                        - Fix the dark theme not sync issue <br/>
                        - Replace Airport Detail Table with Airport Detail Panel <br/>
                    </div>
                    <div>
                        Beta 0.3.4 <br/>
                        - Fix the Home page navigate section button style issue <br/>
                        - Added image modal in Orion page <br/>
                        - Change background color for traffic table <br/>
                        - Added feature that if airport search only return 1 results, instead showing airport list,
                        - direct render the airport detail page <br/>
                    </div>
                    <div>
                        Beta 0.3.5 <br/>
                        - Added TAF and TAF decoder <br/>
                        - Added UTC and Local time display in airport detail page <br/>
                        - Display the ICAO in Airport Detail Page URL <br/>
                        - Change the React-Router so user could change ICAO in URL directly <br/>
                        - Render puzzle image directly instead base64 encoded string <br/>
                        - Check the puzzle answer in back-end <br/>
                    </div>
                    <div>
                        Beta 0.4 <br/>
                        - Added Vatsim event feature <br/>
                        - Fix the issue if no localStorage data enter new ICAO in airport detail page will direct
                        back to home page <br/>
                        - Fix container height issue when using 100% viewport in some components <br/>
                    </div>
                    <div>
                        Beta 0.4.1 <br/>
                        - Vite migration &#9889;<br/>
                        - Added interactive map <br/>
                        - Fix theme not correctly apply issue <br/>
                    </div>
                    <div>
                        Beta 0.4.2 <br/>
                        - Fix the issue that FIR and Tracon popup not display all controllers <br/>
                        - Improve the matching logic to include some missing Tracons <br/>
                        - Added a map layer to display all FIRs boundaries <br/>
                        - Added a map layer to display global day-night terminator <br/>
                    </div>
                    <div>
                        Beta 0.4.3 <br/>
                        - Added new loading screen for AirportDetail page <br/>
                        - Added new logic to matching FSS and Fir <br/>
                        - Added different color for FSS popup <br/>
                        - Fix the issue that some FIRs are missing in the map <br/>
                        - Fix the issue that some FSS are miss matching <br/>
                        - Fix the issue that some Tracon are miss matching <br/>
                    </div>
                    <div>
                        Beta 0.4.3.1 <br/>
                        - Apply changes for API update <br/>
                    </div>
                    <div>
                        Beta 0.4.4 <br/>
                        - Added tooltip for map feature toggle panel <br/>
                        - Added responsive design for map elements <br/>
                        - Added airliner name display <br/>
                        - Fixed the tracon popup for the API update <br/>
                        - Fixed the great circle path drawing got messy if path is crossing the 180° meridian <br/>
                    </div>
                    <div>
                        Beta 0.5 <br/>
                        - Added scroll bar if flight plan is too long is the Flight Panel <br/>
                        - Added option to toggle airport label on map <br/>
                        - Added option to toggle airport marker on map <br/>
                        - Disable tooltip if user is on touchscreen device <br/>
                        - Fix the address bar blocking content in IOS device issue <br/>
                        - Fix page failed to direct when selecting airport directly from weather list <br/>
                        - Adjust map control panel to fit for touchscreen device <br/>
                        - Adjust Home page to be fitted in the IOS device <br/>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center text-xl mt-5">
                Known Issues
                <div>---</div>
                <div>
                    - Map Pitch not reset sometimes after switching terrain mode on to off.
                </div>
                <div className="flex flex-col gap-3"/>
            </div>
        </CustomProvider>
    );
}

export default ChangeLog;

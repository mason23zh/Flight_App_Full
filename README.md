## URL: https://www.airportweather.org

# Beta 0.1

- Initial Release

# Beta 0.1.1

- Dark Mode initial support
- Fix the routing bug
- Background images size compressed
- Fix the dark mode incorrect behavior in Weather component

# Beta 0.1.2

- Fix the dark mode persistence issue when opening the new browser tab
- Added dark mode to NoMatch Page
- Added disclaimer in footer
- Improve the contrast for Get Data button

# Beta 0.2

- Added responsive
- Added logo (By Charlie Wang)
- Rewrite the Weather List (layout fix)
- Rewrite the Airport List (layout fix)
- Rewrite the AirportAccordion (layout fix)
- Rewrite the WeatherAccordion (layout fix)
- Fix the Extreme Weather page layout issue
- Added Extreme Weather header dropdown for responsive design
- Added Navbar dropdown for responsive design
- Rewrite the Airport Detail page

# Beta 0.2.1

- Added margin on input bar <br />
- Added Footer to display disclaimer
- Fix the Map size change in the Airport Detail page
- Fix the width issue when screen become too small
- Adjust the Detail Weather panel when switching to a smaller screen
- Adjust the width for input search bar
- Make some texts first letter capital

# Beta 0.2.2

- Added popular airports in the Home page
- Added ATIS in Airport Detail page
- Fix the issue in localStorage so the theme and airport/weather list will be persistence
  after the refresh
- Fix the issue when loading up a page for the first time will stucked at loading page if no
  localStorage available
- Fix the input bar zoom issue in IOS
- Re-tune the Home page layout to fit smaller screen better
- Fix the Weather input bar not trimming the user input
- Fix the `No Results` text not being centered

# Beta 0.3

- Added popular VatsimEvent airports
- Added visual guidance in the Home page to indicate the page could be scrolled down
- Change display layout for popular airport in Home page
- Fix the visited airport been counted twice issue
- Fix the issue when page is rendering from the bottom
- Fix the issue NotFound page might render if Airport Detail page is taking too long to
  retrieve data

# Beta 0.3.1

- Added responsive to Pagination component in airport search list
- Change airport search list to new display layout
- Fix UI issue in Home page popular airport tab (location render twice)

# Beta 0.3.2

- Added Finding Orion puzzle
- Fix No Results not centered issue in Weather List

# Beta 0.3.3

- Added dark theme map tile in Airport Detail when switching to dark mode
- Added linear-gradient to home page background image
- Automatically detect system dark mode setting
- Make URLs in Airport Detail page table shorter, results a smaller table
- Lower the Home Page background image brightness in dark mode
- Change input field background color to match dark mode
- Change search bar layout for Home, Weather and Airport page
- Added Random Airport feature
- Fix the dark theme not sync issue
- Replace Airport Detail Table with Airport Detail Panel

# Beta 0.3.4

- Fix the Home page navigate section button style issue
- Added image modal in Orion page
- Change background color for traffic table
- Added feature that if airport search only return 1 results, instead showing airport list,
  direct render the airport detail page

# Beta 0.3.5

- Fix the Home page navigate section button style issue
- Added image modal in Orion page
- Change background color for traffic table
- Added feature that if airport search only return 1 results, instead showing airport list,
  direct render the airport detail page

# Beta 0.4

- Added Vatsim event feature
- Fix the issue if no localStorage data enter new ICAO in airport detail page will direct
  back to home page
- Fix container height issue when using 100% viewport in some components

# Beta 0.4.1

- Vite migration
- Added Interactive map
- Fix theme not correctly apply issue

# Beta 0.4.2

- Fix the issue that FIR and Tracon popup not display all controllers
- Improve the matching logic to include some missing Tracons
- Added a map layer to display all FIRs boundaries
- Added a map layer to display global day-night terminator

# Beta 0.4.3

- Added new loading screen for AirportDetail page
- Added new logic to matching FSS and Fir
- Added different color for FSS popup
- Fix the issue that some FIRs are missing in the map
- Fix the issue that some FSS are miss matching
- Fix the issue that some Tracon are miss matching

# Beta 0.4.3.1

- Adjust tracon matching for the API update

# Beta 0.4.4

- Added tooltip for map feature toggle panel
- Added responsive design for map elements
- Added airliner name display
- Fixed the tracon popup for the API update
- Fixed the great circle path drawing got messy if path is crossing the 180° meridian

# Beta 0.5

- Disable tooltip is user is on touchscreen device
- Added scroll bar if flight plan is too long is the Flight Panel
- Fix the address bar blocking content in IOS device issue
- Fix page failed to direct when selecting airport directly from weather list
- Adjust map control panel to fit for touchscreen device
- Adjust Home page to be fitted in the IOS device
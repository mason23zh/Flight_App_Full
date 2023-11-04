import React from "react";
import { CustomProvider } from "rsuite";
import { useFetchSortedVatsimEventsQuery } from "../store";
import { useTheme } from "../hooks/ThemeContext";
import VatsimEventsList from "./VatsimEventsList";
import VatsimEvent from "./VatsimEvent";

function VatsimEventsAll() {
    const darkTheme = useTheme();
    let eventsList;
    const {
        data: vatsimEvents,
        error: vatsimEventsError,
        isFetching: vatsimEventsFetching,
    } = useFetchSortedVatsimEventsQuery("start", 1);
    if (vatsimEvents) {
        eventsList = <VatsimEventsList events={vatsimEvents} />;
    } else if (vatsimEventsFetching) {
        eventsList = (<div>Loading Vatsim Events...</div>);
    } else if (vatsimEventsError) {
        eventsList = (<div>Error Loading Vatsim Events</div>);
    }
    
    
    return (
        <CustomProvider theme={darkTheme ? "dark" : "light"}>
            <div className="flex justify-center p-4">
                <div className="grid grid-cols-6 gap-3">
                    <div className="col-span-2">
                        {eventsList}
                    </div>
                    <div className="col-span-4">
                        <VatsimEvent />
                    </div>
                </div>
            </div>
        </CustomProvider>
    );
}

export default VatsimEventsAll;
 

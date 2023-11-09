import React, { useEffect, useState } from "react";
import { CustomProvider } from "rsuite";
import _ from "lodash";
import { useFetchSortedVatsimEventsQuery } from "../store";
import { useTheme } from "../hooks/ThemeContext";
import VatsimEventsList from "./VatsimEventsList";
import VatsimEvent from "./VatsimEvent";
import VatsimEventDetail from "./VatsimEventDetail";

function VatsimEventsAll() {
    const [selectedEvents, setSelectedEvents] = useState();
    useEffect(() => {
        const events = JSON.parse(localStorage.getItem("vatsimEvent"));
        if (!_.isEmpty(events)) {
            setSelectedEvents(events);
        }
    }, []);
    const darkTheme = useTheme();
    let eventsList;
    const {
        data: vatsimEvents,
        error: vatsimEventsError,
        isFetching: vatsimEventsFetching,
    } = useFetchSortedVatsimEventsQuery();
    if (vatsimEvents) {
        eventsList = <VatsimEventsList events={vatsimEvents} />;
    } else if (vatsimEventsFetching) {
        eventsList = <div>Loading Vatsim Events...</div>;
    } else if (vatsimEventsError) {
        eventsList = <div>Error Loading Vatsim Events</div>;
    }
    
    
    return (
        <CustomProvider theme={darkTheme ? "dark" : "light"}>
            <div className="flex justify-center p-4">
                <div className="grid grid-cols-6 gap-3">
                    <div className="col-span-2">
                        {eventsList}
                    </div>
                    <div className="col-span-4">
                        <VatsimEventDetail />
                    </div>
                </div>
            </div>
        </CustomProvider>
    );
}

export default VatsimEventsAll;
 

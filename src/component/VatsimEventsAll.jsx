import React, { useEffect, useState } from "react";
import { CustomProvider, Drawer, IconButton } from "rsuite";
import MenuIcon from "@rsuite/icons/Menu";
import { useDispatch } from "react-redux";
import { changeUserSelectionVatsimEvent, useFetchSortedVatsimEventsQuery } from "../store";
import { useTheme } from "../hooks/ThemeContext";
import VatsimEventsList from "./VatsimEventsList";
import VatsimEvent from "./VatsimEvent";
import VatsimEventDetail from "./VatsimEventDetail";


function VatsimEventsAll() {
    const dispatch = useDispatch();
    const darkTheme = useTheme();
    
    let eventsList;
    const {
        data: vatsimEvents,
        error: vatsimEventsError,
        isFetching: vatsimEventsFetching,
    } = useFetchSortedVatsimEventsQuery();
    
    useEffect(() => {
        // dispatch the change selection vatsim event to render the first event
        // when page got loaded first time.
        if (vatsimEvents && vatsimEvents?.events.length > 0) {
            dispatch(changeUserSelectionVatsimEvent(vatsimEvents.events[0]));
        }
    }, [vatsimEvents]);
    
    if (vatsimEvents) {
        eventsList = <VatsimEventsList events={vatsimEvents} />;
    } else if (vatsimEventsFetching) {
        eventsList = <div>Loading Vatsim Events...</div>;
    } else if (vatsimEventsError) {
        eventsList = <div>Error Loading Vatsim Events</div>;
    }
    
    const [open, setOpen] = React.useState(false);
    
    const handleOpen = (key) => {
        setOpen(true);
    };
    
    return (
        <CustomProvider theme={darkTheme ? "dark" : "light"}>
            <div>
                <div className="p-1 ml-2 mt-2 block md:hidden">
                    <IconButton icon={<MenuIcon />} onClick={() => handleOpen()}>
                        Events List
                    </IconButton>
                </div>
                <Drawer size="xs" placement="left" open={open} onClose={() => setOpen(false)}>
                    <Drawer.Header>
                        <Drawer.Title>Event List</Drawer.Title>
                        {eventsList}
                    </Drawer.Header>
                </Drawer>
            </div>
            <div className="flex justify-center p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        
                    <div className="hidden md:block md:col-span-2">
                        {eventsList}
                    </div>
                    <div className="col-span-1 md:col-span-4">
                        <VatsimEventDetail />
                    </div>
                </div>
            </div>
        </CustomProvider>
    );
}

export default VatsimEventsAll;
 

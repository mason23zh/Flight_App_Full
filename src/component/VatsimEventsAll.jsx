import React, { useEffect, useState } from "react";
import { CustomProvider, Drawer, IconButton } from "rsuite";
import MenuIcon from "@rsuite/icons/Menu";
import { useDispatch, useSelector } from "react-redux";
import { changeUserSelectionVatsimEvent, useFetchSortedVatsimEventsQuery } from "../store";
import { useTheme } from "../hooks/ThemeContext";
import VatsimEventsList from "./VatsimEventsList";
import VatsimEventDetail from "./VatsimEventDetail";

function VatsimEventsAll() {
    const dispatch = useDispatch();
    const reduxEvent = useSelector((state) => state.vatsimEvent.userSelectionVatsimEvent);
    const darkTheme = useTheme();
    
    let eventsList;
    const {
        data: vatsimEvents,
        error: vatsimEventsError,
        isFetching: vatsimEventsFetching,
    } = useFetchSortedVatsimEventsQuery();
    
    // control drawer open or close
    const [open, setOpen] = React.useState(false);
    
    const handleOpen = (key) => {
        setOpen(true);
    };
    
    const handleClick = () => {
        setOpen(false);
    };
    
    useEffect(() => {
        // dispatch the change selection vatsim event to render the first event
        // when page got loaded first time.
        // If redux store already has the event, do nothing
        if (!reduxEvent.id && vatsimEvents && vatsimEvents?.events.length > 0) {
            dispatch(changeUserSelectionVatsimEvent(vatsimEvents.events[0]));
        }
    }, [vatsimEvents]);
    
    if (vatsimEvents) {
        eventsList = <VatsimEventsList events={vatsimEvents} onClick={handleClick} />;
    } else if (vatsimEventsFetching) {
        eventsList = <div>Loading Vatsim Events...</div>;
    } else if (vatsimEventsError) {
        eventsList = <div>Error Loading Vatsim Events</div>;
    }
    
    return (
        <CustomProvider theme={darkTheme ? "dark" : "light"}>
            <div>
                <div className="p-1 ml-2 mt-2 block md:hidden">
                    <IconButton icon={<MenuIcon />} onClick={() => handleOpen()}>
                        Events List
                    </IconButton>
                </div>
                <Drawer
                    size="xs"
                    placement="left"
                    open={open}
                    onClose={() => setOpen(false)}
                    enforceFocus={false}
                    keyboard
                    backdrop
                >
                    <Drawer.Body>
                        {eventsList}
                    </Drawer.Body>
                </Drawer>
                
            </div>
            <div className="flex justify-center p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <div className="hidden md:block md:col-span-2">
                        {eventsList}
                    </div>
                    <div className="col-span-1 md:col-span-4">
                        <VatsimEventDetail onlyDetail={false} />
                    </div>
                </div>
            </div>
        </CustomProvider>
    );
}

export default VatsimEventsAll;
 

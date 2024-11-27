import React, { useEffect } from "react";
import { CustomProvider, Drawer, IconButton } from "rsuite";
import MenuIcon from "@rsuite/icons/Menu";
import { useDispatch, useSelector } from "react-redux";
import { changeUserSelectionVatsimEvent, useFetchSortedVatsimEventsQuery } from "../store";
import { useTheme } from "../hooks/ThemeContext";
import VatsimEventsList from "./VatsimEventsList";
import VatsimEventDetail from "./VatsimEventDetail";
import { RootState } from "../store";
import { Event } from "../types";

function VatsimEventsAll() {
    const dispatch = useDispatch();
    const reduxEvent: Partial<Event> = useSelector<RootState>((state) => state.vatsimEvent.userSelectionVatsimEvent);
    const darkTheme = useTheme();

    let eventsList;
    const {
        data: vatsimEvents,
        error: vatsimEventsError,
        isFetching: vatsimEventsFetching,
    } = useFetchSortedVatsimEventsQuery();

    // control drawer open or close
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
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
        eventsList = <VatsimEventsList events={vatsimEvents} onClick={handleClick}/>;
    } else if (vatsimEventsFetching) {
        eventsList = <div>Loading Vatsim Events...</div>;
    } else if (vatsimEventsError) {
        eventsList = <div>Error Loading Vatsim Events</div>;
    }

    const scrollBarStyle = darkTheme
        ?
        "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar " +
            "scrollbar-thumb-gray-300 scrollbar-track-slate-500"
        :
        "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar " +
            "scrollbar-thumb-slate-400 scrollbar-track-gray-300";
    //className={`h-[calc(100vh-56px)] flex flex-col ${darkTheme ? "bg-gray-900" : "bg-gray-200"}`}
    return (
        <CustomProvider theme={darkTheme ? "dark" : "light"}>
            <div className={`flex flex-col flex-grow h-[calc(100vh-56px)] ${darkTheme ? "bg-gray-900" : "bg-gray-200"} overflow-hidden`}>
                {/* Drawer for mobile view */}
                <div className="p-1 ml-2 mt-2 block md:hidden">
                    <IconButton icon={<MenuIcon/>} onClick={handleOpen}>
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
                    <Drawer.Body>{eventsList}</Drawer.Body>
                </Drawer>

                {/* Main Layout for Desktop with controlled height */}
                <div className="flex-grow flex md:flex-row overflow-hidden">
                    {/* Event List Sidebar */}
                    <div className="hidden md:block md:w-1/3 p-4">
                        {eventsList}
                    </div>
                    {/* Event Details Section */}
                    <div className={`w-full md:w-2/3 p-4 overflow-y-auto ${scrollBarStyle}`}>
                        <VatsimEventDetail onlyDetail={false}/>
                    </div>
                </div>
            </div>
        </CustomProvider>
    );
}

export default VatsimEventsAll;
 

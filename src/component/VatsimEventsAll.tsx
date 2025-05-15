import { useEffect, useState } from "react";
import { CustomProvider, Drawer, IconButton } from "rsuite";
import MenuIcon from "@rsuite/icons/Menu";
import { useDispatch, useSelector } from "react-redux";
import { changeUserSelectionVatsimEvent, useFetchSortedVatsimEventsQuery } from "../store";
import { useTheme } from "../hooks/ThemeContext";
import VatsimEventsList from "./VatsimEventsList";
import VatsimEventDetail from "./VatsimEventDetail";
import { RootState } from "../store";
import { Event } from "../types";
import { Helmet } from "react-helmet-async";

function VatsimEventsAll() {
    const dispatch = useDispatch();
    const reduxEvent: Partial<Event> = useSelector<RootState>((state) => state.vatsimEvent.userSelectionVatsimEvent);
    const darkTheme = useTheme();

    let eventsList: JSX.Element;
    const {
        data: vatsimEvents,
        error: vatsimEventsError,
        isFetching: vatsimEventsFetching,
    } = useFetchSortedVatsimEventsQuery();

    // control drawer open or close
    const [open, setOpen] = useState(false);

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
        eventsList = <VatsimEventsList events={vatsimEvents} onClick={handleClick} />;
    } else if (vatsimEventsFetching) {
        eventsList = <div>Loading Vatsim Events...</div>;
    } else if (vatsimEventsError) {
        eventsList = <div>Error Loading Vatsim Events</div>;
    }

    const scrollBarStyle = darkTheme
        ? "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar " +
        "scrollbar-thumb-gray-300 scrollbar-track-slate-500"
        : "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar " +
        "scrollbar-thumb-slate-400 scrollbar-track-gray-300";

    return (
        <>
            <Helmet>
                <title>VATSIM Events</title>
                <meta
                    name="description"
                    content="Explore a comprehensive list of VATSIM events, including detailed event information, schedules, and associated airports. Easily view events currently in progress and plan your virtual flights with precision. Stay connected with the VATSIM network through up-to-date event details and airport participation."
                />
                <meta
                    name="keyword"
                    content="VATSIM events, Virtual aviation events, Live VATSIM events, VATSIM event schedule, Ongoing VATSIM events, VATSIM events airports, VATSIM event details, VATSIM flight events"
                />
                <link rel="canonical" href="https://airportweather.org/events" />
            </Helmet>
            <CustomProvider theme={darkTheme ? "dark" : "light"}>
                <div
                    className={`flex flex-col flex-grow h-[calc(100vh-1000px)] ${darkTheme ? "bg-gray-900" : "bg-gray-200"} overflow-hidden`}
                >
                    {/* Drawer for mobile view */}
                    <div className="p-1 ml-2 mt-2 block md:hidden">
                        <IconButton icon={<MenuIcon />} onClick={handleOpen}>
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
                        <div className="hidden md:block md:w-1/3 px-4">{eventsList}</div>
                        {/* Event Details Section */}
                        <div className={`w-full md:w-2/3 p-4 overflow-y-auto ${scrollBarStyle}`}>
                            <VatsimEventDetail onlyDetail={false} />
                        </div>
                    </div>
                </div>
            </CustomProvider>
        </>
    );
}

export default VatsimEventsAll;
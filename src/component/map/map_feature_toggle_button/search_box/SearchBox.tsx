/*
 * To render all contents returned from the Dexie DB
 * The visibility of this component is controlled by SearchButton component
 *
 * */
import React, { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import MapSearchInputBar from "./MapSearchInputBar";
import { searchAirports, searchByAircraftType, searchVatsimTraffic } from "./mapSearchFunction";
import SearchBoxAirportDisplaySection from "./SearchBoxAirportDisplaySection";
import { CustomProvider } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { toggleSearchBox } from "../../../../store";
import SearchBoxFlightDisplaySection from "./SearchBoxFlightDisplaySection";
import SearchBoxAircraftDisplaySection from "./SearchBoxAircraftDisplaySection";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { RootState, setSearchInput, setTabSelection } from "../../../../store";
import SearchBox_TabButtonGroup from "./SearchBox_TabButtonGroup";

type TabSelection = "airports" | "flights" | "aircraft";
const SearchBox = () => {
    const dispatch = useDispatch();
    const { searchInput, tabSelection } = useSelector((state: RootState) => state.mapSearchBox);

    /*
     * Dispatch the setSearchInput action to store the previous search input
     * */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchInput(event.target.value));
    };

    const searchResults = useLiveQuery(
        async () => {
            try {
                const airports = await searchAirports(searchInput.trim());
                const vatsimTraffic = await searchVatsimTraffic(searchInput.trim());
                const aircraftType = await searchByAircraftType(searchInput.trim());

                return {
                    airports,
                    vatsimTraffic,
                    aircraftType,
                };
            } catch (e) {
                console.error("Error searching:", e);
                return {
                    airports: [],
                    vatsimTraffic: [],
                    aircraftType: [],
                };
            }
        },
        [searchInput],
        {
            airports: [],
            vatsimTraffic: [],
            aircraftType: [],
        }
    );

    const closeButtonOnClick = () => {
        dispatch(toggleSearchBox(false));
    };

    /*
     * Store the tab selection
     *  */
    const handleTabChange = (tab: TabSelection) => {
        dispatch(setTabSelection(tab));
    };

    /*
    Fallback, if no tab selected, set airports as default.
    * */
    useEffect(() => {
        if (!tabSelection) {
            dispatch(setTabSelection("airports"));
        }
    }, [tabSelection, dispatch]);

    const renderContent = () => {
        switch (tabSelection) {
            case "airports":
                return <SearchBoxAirportDisplaySection airports={searchResults.airports} />;
            case "flights":
                return <SearchBoxFlightDisplaySection flights={searchResults.vatsimTraffic} />;
            case "aircraft":
                return <SearchBoxAircraftDisplaySection aircrafts={searchResults.aircraftType} />;
            default:
                return null;
        }
    };

    const wrapperStyle =
        "fixed z-[200] top-5 sm:top-12 left-1/2 transform -translate-x-1/2" +
        " w-[19rem] sm:w-[22rem] max-w-[90%] sm:left-16 sm:right-auto sm:translate-x-0 sm:translate-y-[5%] " +
        "bottom-10 max-h-[40rem] min-h-[15rem] animate-fadeIn";

    return (
        <CustomProvider theme="light">
            <div className={wrapperStyle}>
                <div className="flex flex-col h-[90%] bg-gray-500 text-white rounded-lg overflow-hidden">
                    <button
                        className="justify-self-end align-middle text-lg px-1 py-0 hover:text-gray-900"
                        onClick={closeButtonOnClick}
                    >
                        <IoMdCloseCircleOutline />
                    </button>
                    <MapSearchInputBar handleChange={handleChange} searchInput={searchInput} />

                    <SearchBox_TabButtonGroup
                        onTabChange={handleTabChange}
                        activeTab={tabSelection}
                        airportNumber={searchResults?.airports?.length | 0}
                        trafficNumber={searchResults?.vatsimTraffic?.length | 0}
                        aircraftNumber={searchResults?.aircraftType?.length | 0}
                    />

                    <div className="flex-1 overflow-y-auto">{renderContent()}</div>
                </div>
            </div>
        </CustomProvider>
    );
};

export default SearchBox;

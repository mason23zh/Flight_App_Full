/*
* To render all contents returned from the Dexie DB
* The visibility of this component is controlled by SearchButton component
*
* */
import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import MapSearchInputBar from "./MapSearchInputBar";
import { searchAirports, searchByAircraftType, searchVatsimTraffic } from "./mapSearchFunction";
import SearchBoxAirportDisplaySection from "./SearchBoxAirportDisplaySection";
import { Tabs } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { toggleSearchBox } from "../../../../store/slices/vatsimMapVisibleSlice";
import SearchBoxFlightDisplaySection from "./SearchBoxFlightDisplaySection";
import SearchBoxAircraftDisplaySection from "./SearchBoxAircraftDisplaySection";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { RootState, setSearchInput, setTabSelection } from "../../../../store";


const SearchBox = () => {
    const dispatch = useDispatch();
    const {
        searchInput,
        tabSelection
    } = useSelector((state: RootState) => state.mapSearchBox);

    /*
    * Dispatch the setSearchInput action to store the previous search input
    * */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchInput(event.target.value));
    };


    const searchResults = useLiveQuery(
        async () => {
            try {
                const airports = await searchAirports(searchInput);
                const vatsimTraffic = await searchVatsimTraffic(searchInput);
                const aircraftType = await searchByAircraftType(searchInput);
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
    const handleTabSelect = (key: string) => {
        dispatch(setTabSelection(key));
    };

    return (
        <div
            className="absolute left-[110%] bg-gray-500 min-w-[350px] 
            rounded-lg grid grid-cols-1 text-gray-100">
            <button
                className="justify-self-end align-middle text-lg px-1 py-0 hover:text-gray-900"
                onClick={closeButtonOnClick}
            >
                <IoMdCloseCircleOutline/>
            </button>
            <MapSearchInputBar
                handleChange={handleChange}
                searchInput={searchInput}
            />
            <div className="p-2">
                <Tabs
                    defaultActiveKey={tabSelection}
                    onSelect={(key) => handleTabSelect(key)}
                >
                    <Tabs.Tab
                        eventKey="1"
                        title={`Airports (${searchResults.airports.length})`}>
                        <SearchBoxAirportDisplaySection airports={searchResults.airports}/>
                    </Tabs.Tab>

                    <Tabs.Tab
                        eventKey="2"
                        title={`Flights (${searchResults.vatsimTraffic.length})`}>
                        <SearchBoxFlightDisplaySection flights={searchResults.vatsimTraffic}/>
                    </Tabs.Tab>

                    <Tabs.Tab
                        eventKey="3"
                        title={`Aircraft (${searchResults.aircraftType.length})`}>
                        <SearchBoxAircraftDisplaySection aircrafts={searchResults.aircraftType}/>
                    </Tabs.Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default SearchBox;
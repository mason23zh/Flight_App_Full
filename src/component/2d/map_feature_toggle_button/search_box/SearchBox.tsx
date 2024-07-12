/*
* To render all contents returned from the Dexie DB
* The visibility of this component is controlled by SearchButton component
*
* */
import React, { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useTheme } from "../../../../hooks/ThemeContext";
import MapSearchInputBar from "./MapSearchInputBar";
import { searchAirports, searchByAircraftType, searchVatsimTraffic } from "./mapSearchFunction";
import SearchBoxAirportDisplaySection from "./SearchBoxAirportDisplaySection";
import { Tabs } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { toggleSearchBox } from "../../../../store/slices/vatsimMapVisibleSlice";
import { RootState } from "../../../../store";
import SearchBoxFlightDisplaySection from "./SearchBoxFlightDisplaySection";
import SearchBoxAircraftDisplaySection from "./SearchBoxAircraftDisplaySection";


const SearchBox = () => {
    const darkMode = useTheme();
    const { searchBoxVisible } = useSelector((state: RootState) => state.vatsimMapVisible);
    const searchBoxRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const [searchInput, setSearchInput] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBoxRef.current &&
                    !searchBoxRef.current.contains(event.target as Node) &&
                    !(event.target as HTMLElement).closest("#search-button")
            ) {
                dispatch(toggleSearchBox(false));
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dispatch, searchBoxVisible]);

    return (
        <div ref={searchBoxRef}
            className="absolute left-[110%] bg-gray-500 min-w-[350px] 
            rounded-lg grid grid-cols-1 text-gray-100">
            <MapSearchInputBar
                handleChange={handleChange}
                searchInput={searchInput}
                darkMode={darkMode}
            />
            <div className="p-2">
                <Tabs defaultActiveKey="1" className="">
                    <Tabs.Tab eventKey="1" title={`Airports (${searchResults.airports.length})`}>
                        <SearchBoxAirportDisplaySection airports={searchResults.airports}/>
                    </Tabs.Tab>

                    <Tabs.Tab eventKey="2" title={`Flights (${searchResults.vatsimTraffic.length})`}>
                        <SearchBoxFlightDisplaySection flights={searchResults.vatsimTraffic}/>
                    </Tabs.Tab>


                    <Tabs.Tab eventKey="3" title={`Aircraft (${searchResults.aircraftType.length})`}>
                        <SearchBoxAircraftDisplaySection aircrafts={searchResults.aircraftType}/>
                    </Tabs.Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default SearchBox;
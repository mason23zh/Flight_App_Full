import "../styles.css";
import React, { useState } from "react";
import { Pagination } from "rsuite";
import AirportListInfoTab from "./AirportListInfoTab";

function AirportsList({ airports, goToPage }) {
    const [layout, setLayout] = useState(["total", "-", "|", "pager", "skip"]);
    
    const { data } = airports;
    let renderedAirports;
    if (data.airports.length === 0) {
        renderedAirports = <div className="text-lg text-center">No Results</div>;
    } else {
        renderedAirports = data.airports.map((airport) => (
            <div key={airport.ICAO}>
                <AirportListInfoTab airport={airport} />
            </div>
        ));
    }
    
    const handleGoToPage = (page) => {
        goToPage(page);
    };
    
    return (
        <div className="flex flex-col items-center ">
            <div className="grid grid-cols-1 gap-5 auto-rows-fr p-2 w-[75%] mt-3 mb-3">
                {renderedAirports}
            </div>
            {data.airports.length !== 0 ? (
                <Pagination
                    size="md"
                    layout={layout}
                    total={data.totalAirports}
                    activePage={data.page}
                    limit={10}
                    next={data.nextPage !== null}
                    prev={data.prevPage !== null}
                    first
                    last
                    boundaryLinks
                    maxButtons={5}
                    onChangePage={handleGoToPage}
                />
            ) : <></>}
        </div>
    );
}

export default AirportsList;

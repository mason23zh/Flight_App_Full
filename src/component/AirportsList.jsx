import "../styles.css";
import React, { useState } from "react";
import { Pagination } from "rsuite";
import AirportAccordion from "./AirportAccordion";

function AirportsList({ airports, goToPage }) {
    const [layout, setLayout] = useState(["total", "-", "|", "pager", "skip"]);
    
    const { data } = airports;
    let renderedAirports;
    if (data.airports.length === 0) {
        localStorage.clear();
        renderedAirports = <div className="text-lg">No Results</div>;
    } else {
        renderedAirports = data.airports.map((airport) => (
            <div key={airport.ICAO}>
                <AirportAccordion airport={airport} />
            </div>
        ));
    }
    
    
    const handleGoToPage = (page) => {
        goToPage(page);
    };
    
    return (
        <div className="flex flex-col items-center mr-auto">
            <div className="flex flex-col items-stretch gap-4 p-10 items-center w-[80%]">{renderedAirports}</div>
            {data.airports.length !== 0 ? (
                <Pagination
                    size="lg"
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

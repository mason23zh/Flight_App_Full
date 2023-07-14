import React, { useState } from "react";
import "../styles.css";
import { Pagination } from "rsuite";
import AirportDisplay from "./AirportDisplay";
import AirportAccordion from "./AirportAccordion";


function AirportsList({ airports, goToPage }) {
    const [layout, setLayout] = useState(["total", "-", "|", "pager", "skip"]);
    const [pageNumber, setPageNumber] = useState(1);
    
    const { data } = airports;
    const renderedAirports = data.airports.map((airport) => (
        <div key={airport.ICAO}>
            <AirportAccordion airport={airport} />
        </div>
    ));
    
    const handleGoToPage = (page) => {
        goToPage(page);
    };
    
    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col gap-4 p-10 items-center ">{renderedAirports}</div>
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
        </div>
    );
}

export default AirportsList;

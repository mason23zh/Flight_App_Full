import React from "react";
import "../styles.css";
import { Pagination } from "rsuite";
import AirportDisplay from "./AirportDisplay";
import AirportAccordion from "./AirportAccordion";


function AirportsList({ airports }) {
    const [layout, setLayout] = React.useState(["total", "-", "limit", "|", "pager", "skip"]);
    
    const { data } = airports;
    // console.log(data);
    const renderedAirports = data.airports.map((airport) => (
        <div key={airport.ICAO}>
            <AirportAccordion airport={airport} />
        </div>
    ));
    
    const showGoToPage = (page) => {
        // console.log("GO TO PAGE", page);
    };
    
    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col gap-4 p-10 items-center ">{renderedAirports}</div>
            <Pagination
                // layout={["total", "|", "", "page", "skip"]}
                total={data.totalAirports}
                activePage={1}
                limit={10}
                next={data.nextPage !== null}
                prev={data.prevPage !== null}
                first
                last
                boundaryLinks
                maxButtons={5}
            />
        </div>
    );
}

export default AirportsList;

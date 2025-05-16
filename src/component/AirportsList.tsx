import "../styles.css";
import { useState } from "react";
import { Pagination } from "rsuite";
import AirportListInfoTab from "./AirportListInfoTab";

function AirportsList({ airports, goToPage }) {
    type LayoutType = "total" | "-" | "pager" | "|" | "limit" | "skip";

    const [layout] = useState<LayoutType[]>(["total", "-", "|", "pager", "skip"]);
    const [smLayout] = useState<LayoutType[]>(["pager"]);

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

    const renderPagination = (
        <>
            <div className="hidden md:block">
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
                ) : (
                    <></>
                )}
            </div>

            <div className="block md:hidden">
                {data.airports.length !== 0 ? (
                    <Pagination
                        size="sm"
                        layout={smLayout}
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
                ) : (
                    <></>
                )}
            </div>
        </>
    );

    return (
        <div className="flex flex-col items-center ">
            <div className="grid grid-cols-1 gap-5 auto-rows-fr p-2 w-[75%] mt-3 mb-3">
                {renderedAirports}
            </div>
            <div className="ml-3 mr-3">{renderPagination}</div>
        </div>
    );
}

export default AirportsList;

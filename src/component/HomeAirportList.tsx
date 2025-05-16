import HomePopularAirportInfoTab from "./HomePopularAirportInfoTab";

function HomeAirportList({ airports }) {
    const { data } = airports;
    let renderedAirports;
    if (data.length === 0) {
        renderedAirports = <div className="text-lg text-center">No Results</div>;
    } else {
        renderedAirports = data.map((airport, i) => (
            <div key={airport.ICAO}>
                <HomePopularAirportInfoTab airport={airport} counter={i} />
            </div>
        ));
    }

    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 gap-5 auto-rows-fr p-2 w-[80%] mt-3 mb-3">
                {renderedAirports}
            </div>
        </div>
    );
}

export default HomeAirportList;

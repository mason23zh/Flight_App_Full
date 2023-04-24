import AirportDisplay from "./AirportDisplay";

const AirportsList = ({ airports }) => {
    const renderedAirports = airports.map((airport) => {
        return (
            <div key={airport.id}>
                <AirportDisplay airport={airport} />
            </div>
        );
    });

    return <div>{renderedAirports}</div>;
};

export default AirportsList;

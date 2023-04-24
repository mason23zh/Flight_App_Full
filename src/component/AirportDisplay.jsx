const AirportDisplay = ({ airport }) => {
    const { ICAO, elevation, location, name, runways, transitionAltitude } = airport;
    const renderedRunways = runways.map((runway) => {
        return (
            <div key={runway._id}>
                {runway.runway_id}
                <br />
                {runway.ilsFreq === 0 ? "No ILS" : `ILS Freq: ${runway.ilsFreq}`}
            </div>
        );
    });
    return (
        <div>
            ICAO: {ICAO}
            <br />
            Elevation: {elevation}
            <br />
            Name: {name}
            <br />
            Location: {location.coordinates[0]},{location.coordinates[1]}
            <br />
            {renderedRunways}
            <br />
            TransitionAltitude: {transitionAltitude}
            <hr />
        </div>
    );
};

export default AirportDisplay;

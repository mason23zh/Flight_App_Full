import React from "react";
import { Panel } from "rsuite";

function AirportDetailPanel({
    ICAO,
    iata,
    region,
    country,
    runwayCount,
    airportType,
    elevation,
    transitionAltitude,
    lng,
    lat,
    homeLink,
    wikiLink,
}) {
    return (
        <div>
            <Panel header={`${ICAO} Detail Information`} collapsible bordered defaultExpanded />
        </div>
    );
}

export default AirportDetailPanel;

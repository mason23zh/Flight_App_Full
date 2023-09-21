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
    const renderHeader = () => (
        <div className="flex items-center">
            `${ICAO} Detail Information`
        </div>
    );
    
    
    return (
        <Panel header={`${ICAO} Detail Information`} collapsible bordered defaultExpanded>
            <div className="grid gird-cols-2 gap-2 text-sm sm:text-lg">
                <div className="hover:border rounded-xl">
                    <div className="grid grid-cols-2 ">
                        <div className="text-left sm:text-center">ICAO</div>
                        <div className="text-right sm:text-center">
                            {ICAO}
                        </div>
                    </div>
                </div>
                    
                <div className="hover:border rounded-xl">
                    <div className="grid grid-cols-2 ">
                        <div className="text-left sm:text-center">IATA</div>
                        <div className="text-right sm:text-center">
                            {iata}
                        </div>
                    </div>
                </div>
                    
                <div className="hover:border rounded-xl">
                    <div className="grid grid-cols-2 ">
                        <div className="text-left sm:text-center">Region:</div>
                        <div className="text-right sm:text-center">
                            {region}
                        </div>
                    </div>
                </div>
                    
                <div className="hover:border rounded-xl">
                    <div className="grid grid-cols-2 ">
                        <div className="text-left sm:text-center">Country</div>
                        <div className="text-right sm:text-center">
                            {country}
                        </div>
                    </div>
                </div>
                    
                <div className="hover:border rounded-xl">
                    <div className="grid grid-cols-2 ">
                        <div className="text-left sm:text-center">Number of runways</div>
                        <div className="text-right sm:text-center">
                            {runwayCount}
                        </div>
                    </div>
                </div>
                    
                <div className="hover:border rounded-xl">
                    <div className="grid grid-cols-2 ">
                        <div className="text-left sm:text-center">Elevation</div>
                        <div className="text-right sm:text-center">
                            {elevation} ft
                        </div>
                    </div>
                </div>
                    
                <div className="hover:border rounded-xl">
                    <div className="grid grid-cols-2 ">
                        <div className="text-left sm:text-center">Transition Altitude</div>
                        <div className="text-right sm:text-center">
                            {transitionAltitude} ft
                        </div>
                    </div>
                </div>
                    
                <div className="hover:border rounded-xl">
                    <div className="grid grid-cols-2 ">
                        <div className="text-left sm:text-center">Type</div>
                        <div className="text-right sm:text-center">
                            {airportType.includes("_") ? airportType.replace("_", " ") : airportType}
                        </div>
                    </div>
                </div>
                    
                <div className="hover:border rounded-xl">
                    <div className="grid grid-cols-2 ">
                        <div className="text-left sm:text-center">Coordinates</div>
                        <div className="text-right sm:text-center">
                            {lat}, {lng}
                        </div>
                    </div>
                </div>
                    
                <div className="hover:border rounded-xl">
                    <div className="grid grid-cols-2 ">
                        <div className="text-left sm:text-center">Home Page</div>
                        <div className="text-right sm:text-center">
                            {homeLink
                                ? (
                                    <a href={homeLink} target="_blank" rel="noreferrer">
                                        {ICAO} Home Page
                                    </a>
                                )
                                : "N/A"}
                        </div>
                    </div>
                </div>
                    
                <div className="hover:border rounded-xl">
                    <div className="grid grid-cols-2 ">
                        <div className="text-left sm:text-center">Wiki Page</div>
                        <div className="text-right sm:text-center">
                            {wikiLink
                                ? (
                                    <a href={wikiLink} target="_blank" rel="noreferrer">
                                        {ICAO} Wiki Page
                                    </a>
                                ) : "N/A"}
                        </div>
                    </div>
                </div>
                
                
            </div>
        </Panel>
    );
}

export default AirportDetailPanel;

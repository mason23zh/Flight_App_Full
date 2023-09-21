import React from "react";
import Iframe from "react-iframe";
import { useTheme } from "@/hooks/ThemeContext";

function AirportDetailTrafficWidget({ iata, airportName }) {
    const darkMode = useTheme();
    return (
        <div>
          
            <Iframe
                title="traffic"
                className="border-0 w-[90vw] min-h-[650px] m-0 p-0"
                // height="1000px"

                styles={{ filter: darkMode && "invert(1) hue-rotate(180deg)"}}
                url={`https://www.avionio.com/widget/en/${iata}/departures`}
            />
            
            <div className="text-sm  text-center border-t-gray-500">
                <a
                    className="text-cyan-600 no-underline"
                    href={`https://www.avionio.com/en/airport/${iata}/departures`}
                    title={`${airportName} arrivals`}
                    target="_blank"
                    rel="noreferrer"
                >{`${airportName} (${iata}) arrivals `}
                </a>
                {"powered by "}
                <a
                    className="no-underline text-cyan-600;"
                    href="https://www.avionio.com/"
                    target="_blank"
                    title="Arrivals, departures, flights tracker"
                    rel="noreferrer"
                > Avionio.com
                </a>
            </div>
        </div>
    
    );
}

export default AirportDetailTrafficWidget;

import Iframe from "react-iframe";
import { useTheme } from "../hooks/ThemeContext";

function AirportDetailTrafficWidget({
    iata,
    airportName
}) {
    const darkMode = useTheme();
    // filter: turn bgColor to black first, and invert. 
    return (
        <div>
            <Iframe
                title="traffic"
                className="border-0 w-[100%] h-[95%] min-h-[650px] m-0 p-0"
                url={`https://www.avionio.com/widget/en/${iata}/departures`}
                styles={{ filter: darkMode && "invert(1) invert(15%) sepia(50%) saturate(50%) hue-rotate(180deg) brightness(90%) contrast(110%)" }}
            />
            <div className="text-sm w-[100%] text-center pt-[7px] border-t-2 border-t-gray-500">
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
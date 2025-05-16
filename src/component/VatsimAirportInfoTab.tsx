import { GiAirplaneDeparture, GiAirplaneArrival } from "react-icons/gi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";
import { useDispatch } from "react-redux";
import { setSelectedAirportICAO } from "../store";

function VatsimAirportInfoTab({ airport, counter }) {
    const dispatch = useDispatch();
    const { ICAO, iata, station, arrivalNumber, departureNumber, controller } = airport;
    const icaoAndIata =
        iata.length === 0 ? (
            <div>{ICAO}</div>
        ) : (
            <div className="flex justify-center items-center gap-1">
                <div>{ICAO}</div>
                <div className="hidden md:block">/</div>
                <div className="hidden md:block">{iata}</div>
            </div>
        );

    const darkMode = useTheme();
    const themeClass = darkMode
        ? "border-2 rounded-3xl grid grid-cols-3 " +
          "sm:grid-cols-4 md:grid-cols-6 text-center justify-items-center items-center " +
          "h-full bg-gray-500"
        : "border-2 rounded-3xl grid grid-cols-3 " +
          "sm:grid-cols-4 md:grid-cols-6 text-center justify-items-center items-center " +
          "h-full bg-gray-300";

    const delIcon = controller.DEL ? (
        <div className="border-2 bg-blue-500 text-center " title="Delivery">
            <div className="p-1">D</div>
        </div>
    ) : (
        <></>
    );

    const gndIcon = controller.GND ? (
        <div className="border-2 bg-green-500 text-center" title="Ground">
            <div className="p-1">G</div>
        </div>
    ) : (
        <></>
    );

    const twrIcon = controller.TWR ? (
        <div className="border-2 bg-red-500 text-center" title="Tower">
            <div className="p-1">T</div>
        </div>
    ) : (
        <></>
    );

    const appIcon = controller.APP ? (
        <div className="border-2 bg-blue-500 text-center" title="Approach">
            <div className="p-1">A</div>
        </div>
    ) : (
        <></>
    );

    const atisIcon = controller.ATIS ? (
        <div className="border-2 bg-yellow-500 text-center" title="ATIS">
            <div className="p-1">A</div>
        </div>
    ) : (
        <></>
    );

    const arrivalTraffic =
        arrivalNumber && arrivalNumber > 0 ? (
            <div className="flex items-center gap-1">
                <GiAirplaneArrival size={25} />
                <div>{arrivalNumber}</div>
            </div>
        ) : (
            <></>
        );

    const departureTraffic =
        departureNumber && departureNumber > 0 ? (
            <div className="flex items-center gap-1">
                <GiAirplaneDeparture size={25} />
                <div>{departureNumber}</div>
            </div>
        ) : (
            <></>
        );

    const trafficSections = (
        <div className="flex gap-3 items-center">
            {arrivalTraffic}
            {departureTraffic}
        </div>
    );

    const nameSection = <div className="items-center">{station.name}</div>;

    const icaoSection = <div>{icaoAndIata}</div>;

    const goToAirportIcon = (
        <Link to={`airport/detail/${ICAO}`} onClick={() => dispatch(setSelectedAirportICAO(ICAO))}>
            <IoIosArrowRoundForward size={40} />
        </Link>
    );

    const controllerIconsSection = (
        <div className="flex items-center">
            <div>{delIcon}</div>
            <div>{gndIcon}</div>
            <div>{twrIcon}</div>
            <div>{appIcon}</div>
            <div>{atisIcon}</div>
        </div>
    );

    const counterSection = <div className="border-1">#{counter + 1}</div>;

    return (
        <div className={themeClass}>
            <div className="justify-self-start ml-4 p-2 hidden md:block">{counterSection}</div>
            <div className="justify-self-start p-2 ml-1 md:ml-0">{icaoSection}</div>
            <div className="p-2 hidden md:block">{nameSection}</div>
            <div className="p-2 hidden sm:block">{controllerIconsSection}</div>
            <div className="p-2 md:mr-4 justify-self-center">{trafficSections}</div>
            <div className="justify-self-end mr-3">{goToAirportIcon}</div>
        </div>
    );
}

export default VatsimAirportInfoTab;

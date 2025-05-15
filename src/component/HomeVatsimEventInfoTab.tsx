import moment from "moment";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTheme } from "../hooks/ThemeContext";
import { changeUserSelectionVatsimEvent } from "../store";

function HomeVatsimEventInfoTab({
    event,
    counter
}) {
    const {
        end_time,
        start_time,
        link,
        name,
    } = event;
    const dispatch = useDispatch();

    const darkMode = useTheme();
    const themeClass = darkMode
        ? "border-2 rounded-3xl grid grid-cols-3 "
        + "sm:grid-cols-4 md:grid-cols-5 text-center justify-items-center items-center "
        + "h-full bg-gray-500"
        : "border-2 rounded-3xl grid grid-cols-3 "
        + "sm:grid-cols-4 md:grid-cols-5 text-center justify-items-center items-center "
        + "h-full bg-gray-300";


    // Set localStorage and dispatch the change event action
    // Because right-click open new tab will clear the redux store
    // VatsimEventDetail component will use localStorage data to render
    // for the first time if redux is unavailable
    const handleClick = () => {
        localStorage.setItem("vatsimEvent", JSON.stringify(event));
        dispatch(changeUserSelectionVatsimEvent(event));
    };

    const nameSection = (
        <div className="items-center">
            {name ? <div>{name}</div> : <></>}
        </div>
    );

    const timeSection = (
        <div>
            {(start_time && end_time) ? (
                <div>{moment(start_time)
                    .utc()
                    .format("HH:mm")} to {moment(end_time)
                    .utc()
                    .format("HH:mm")} (UTC)
                </div>
            ) : <></>}
        </div>
    );

    const counterSection = (
        <div className="border-1">
            #{counter + 1}
        </div>
    );

    const linkSection = (
        <div>
            {link ? (
                <a href={link} target="_blank" rel="noreferrer">
                    Event Link
                </a>
            ) : <></>}
        </div>
    );


    const goToSection = (
        <Link
            to={`/vatsim/events/${name}`}
            onMouseOver={handleClick}
        >
            <IoIosArrowRoundForward size={40} />
        </Link>
    );


    return (
        <div className={themeClass}>
            <div className="justify-self-start ml-4 p-2 hidden md:block">
                {counterSection}
            </div>
            <div className="justify-self-start p-2 ml-1 md:ml-0 md:justify-self-center">
                {nameSection}
            </div>
            <div className="p-2 ">
                {timeSection}
            </div>
            <div className="p-2 justify-self-center hidden sm:block">
                {linkSection}
            </div>
            <div className="justify-self-end mr-3">
                {goToSection}
            </div>
        </div>
    );
}

export default HomeVatsimEventInfoTab;
import { COUNTRY_CODE } from "../util/country_code";
import { CONTINENT_CODE } from "../util/contient_code";
import {
    WIND_SPEED,
    WIND_GUST,
    VISIBILITY,
    BARO,
    TEMPERATURE,
    GLOBAL,
    COUNTRY,
    CONTINENT,
} from "../util/selection_names";
import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeUserSelection } from "../store";

const ExtremeWeatherHeader = () => {
    const dispatch = useDispatch();
    const [userSelection, setUserSelection] = useState({ weather: WIND_SPEED, scope: GLOBAL, option: "" });
    const [weatherActive, setWeatherActive] = useState({
        WIND_SPEED: true,
        WIND_GUST: false,
        VISIBILITY: false,
        BARO: false,
        TEMPERATURE: false,
    });
    const [scopeActive, setScopeActive] = useState({ GLOBAL: true, COUNTRY: false, CONTINENT: false });
    const [showDropDown, setShowDropDown] = useState(false);

    useEffect(() => {
        dispatch(changeUserSelection(userSelection));
    }, [userSelection]);

    const buttonClasses = "p-1 rounded text-blue-500 text-lg hover:text-white hover:bg-blue-500 duration-100";
    const activeButtonClass = "p-1 rounded text-white bg-blue-500 text-lg shadow-md";

    const scopeButtonClass =
        "p-1 text-lg bg-amber-400 rounded text-gray-600 hover:bg-green-600 hover:text-white duration-100";
    const activeScopeButtonClass = "p-1 text-lg bg-green-600 text-white rounded shadow-md";

    const handleWeatherButtonClick = (arg) => {
        const updateSelection = {
            ...userSelection,
            option: "",
            weather: arg,
        };

        // set everything to false and set selected button to active
        const newObj = Object.assign({}, weatherActive);
        for (let key in newObj) {
            newObj[key] = false;
        }
        newObj[arg] = true;

        const updatedWeatherActive = {
            ...weatherActive,
            ...newObj,
        };

        setWeatherActive(updatedWeatherActive);
        setUserSelection(updateSelection);
    };
    const handleScopeButtonClick = (arg) => {
        const updatedSelection = {
            ...userSelection,
            option: "",
            scope: arg,
        };

        const newObj = Object.assign({}, scopeActive);
        for (let key in newObj) {
            newObj[key] = false;
        }
        newObj[arg] = true;

        const updatedScopeActive = {
            ...scopeActive,
            ...newObj,
        };
        if (arg === CONTINENT || arg === COUNTRY) {
            setShowDropDown(true);
        } else {
            setShowDropDown(false);
        }
        setScopeActive(updatedScopeActive);
        setUserSelection(updatedSelection);
    };

    const handleDropDownChange = (arg) => {
        const updatedSelection = {
            ...userSelection,
            option: { ...arg },
        };
        setUserSelection(updatedSelection);
    };

    let renderedDropDown;
    if (showDropDown && userSelection.scope === COUNTRY) {
        renderedDropDown = (
            <Dropdown
                value={userSelection.option}
                options={COUNTRY_CODE}
                onChange={handleDropDownChange}
                placeHolderMsg="Select country..."
                className="absolute top-[5%]"
            />
        );
    } else if (showDropDown && userSelection.scope === CONTINENT) {
        renderedDropDown = (
            <Dropdown
                value={userSelection.option}
                options={CONTINENT_CODE}
                onChange={handleDropDownChange}
                placeHolderMsg="Select continent..."
                className="absolute top-[5%]"
            />
        );
    }

    return (
        <div className="flex items-center justify-center gap-10 p-3 mt-1 relative">
            <button
                onClick={() => handleWeatherButtonClick(WIND_SPEED)}
                className={weatherActive.WIND_SPEED ? activeButtonClass : buttonClasses}
            >
                Wind Speed
            </button>
            <button
                onClick={() => handleWeatherButtonClick(WIND_GUST)}
                className={weatherActive.WIND_GUST ? activeButtonClass : buttonClasses}
            >
                Wind Gust
            </button>
            <button
                onClick={() => handleWeatherButtonClick(VISIBILITY)}
                className={weatherActive.VISIBILITY ? activeButtonClass : buttonClasses}
            >
                Visibility
            </button>
            <button
                onClick={() => handleWeatherButtonClick(BARO)}
                className={weatherActive.BARO ? activeButtonClass : buttonClasses}
            >
                Baro
            </button>
            <button
                onClick={() => handleWeatherButtonClick(TEMPERATURE)}
                className={weatherActive.TEMPERATURE ? activeButtonClass : buttonClasses}
            >
                Temperature
            </button>
            <div className="flex items-center justify-center gap-5">
                <button
                    onClick={() => handleScopeButtonClick(GLOBAL)}
                    className={scopeActive.GLOBAL ? activeScopeButtonClass : scopeButtonClass}
                >
                    Global
                </button>
                <button
                    onClick={() => handleScopeButtonClick(COUNTRY)}
                    className={scopeActive.COUNTRY ? activeScopeButtonClass : scopeButtonClass}
                >
                    Country
                </button>
                <button
                    onClick={() => handleScopeButtonClick(CONTINENT)}
                    className={scopeActive.CONTINENT ? activeScopeButtonClass : scopeButtonClass}
                >
                    Continent
                </button>
                <div>{renderedDropDown}</div>
            </div>
        </div>
    );
};

export default ExtremeWeatherHeader;

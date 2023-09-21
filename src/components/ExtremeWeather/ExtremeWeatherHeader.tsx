import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { COUNTRY_CODE } from "@/utils/country_code";
import { CONTINENT_CODE } from "@/utils/contient_code";
import {
    BARO,
    CONTINENT,
    COUNTRY,
    GLOBAL,
    TEMPERATURE,
    VISIBILITY,
    WIND_GUST,
    WIND_SPEED,
} from "@/utils/selection_names";
import { changeUserSelection } from "@/store";
import { useTheme } from "@/hooks/ThemeContext";

function ExtremeWeatherHeader() {
    const darkMode = useTheme();
    const buttonClasses = darkMode
        ? "p-1 rounded text-gray-100 text-lg hover:text-white hover:bg-blue-500 duration-100"
        : "p-1 rounded text-blue-500 text-lg hover:text-white hover:bg-blue-500 duration-100";
    
    const dispatch = useDispatch();
    const [userSelection, setUserSelection] = useState({
        weather: WIND_SPEED,
        scope: GLOBAL,
        code: "",
    });
    const [weatherActive, setWeatherActive] = useState({
        WIND_SPEED: true,
        WIND_GUST: false,
        VISIBILITY: false,
        BARO: false,
        TEMPERATURE: false,
    });
    // eslint-disable-next-line max-len
    const [scopeActive, setScopeActive] = useState({ GLOBAL: true, COUNTRY: false, CONTINENT: false });
    const [showDropDown, setShowDropDown] = useState(false);
    
    useEffect(() => {
        // setup default country/continent code when switching between 'Country' or 'Continent'
        if (userSelection.scope === COUNTRY && userSelection.code.length === 0) {
            const updatedState = {
                ...userSelection,
                code: { value: "ca" },
            };
            setUserSelection(updatedState);
        } else if (userSelection.scope === CONTINENT && userSelection.code.length === 0) {
            const updatedState = {
                ...userSelection,
                code: { value: "na" },
            };
            setUserSelection(updatedState);
        }
        dispatch(changeUserSelection(userSelection));
    }, [userSelection, dispatch]);
    
    const activeButtonClass = "p-1 rounded text-white bg-blue-500 text-lg shadow-md";
    
    const scopeButtonClass = "p-1 text-lg bg-amber-400 rounded text-gray-600 hover:bg-green-600 hover:text-white duration-100";
    const activeScopeButtonClass = "p-1 text-lg bg-green-600 text-white rounded shadow-md";
    
    const handleWeatherButtonClick = (arg) => {
        const updateSelection = {
            ...userSelection,
            weather: arg,
        };
        
        // set everything to false and set selected button to active
        const newObj = { ...weatherActive };
        // eslint-disable-next-line guard-for-in
        for (const key in newObj) {
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
            code: "", // clear the country/continent code
            scope: arg,
        };
        
        const newObj = { ...scopeActive };
        // eslint-disable-next-line guard-for-in
        for (const key in newObj) {
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
    
    const handleSelectChange = (arg) => {
        const updatedSelection = {
            ...userSelection,
            code: { ...arg },
        };
        setUserSelection(updatedSelection);
    };
    
    let renderedDropDown;
    if (showDropDown && userSelection.scope === COUNTRY) {
        renderedDropDown = (
            <Select
                options={COUNTRY_CODE}
                placeholder="Select country..."
                className="absolute top-[5%] w-[200px] text-black"
                onChange={handleSelectChange}
            />
        );
    } else if (showDropDown && userSelection.scope === CONTINENT) {
        renderedDropDown = (
            <Select
                options={CONTINENT_CODE}
                placeholder="Select continent..."
                className="absolute top-[5%] w-[200px] text-black"
                onChange={handleSelectChange}
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
}

export default ExtremeWeatherHeader;

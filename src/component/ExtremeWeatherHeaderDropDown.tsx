import { useEffect, useState } from "react";
import { Dropdown, InputPicker } from "rsuite";
import { useDispatch } from "react-redux";
import {
    BARO,
    CONTINENT,
    COUNTRY,
    GLOBAL,
    TEMPERATURE,
    VISIBILITY,
    WIND_GUST,
    WIND_SPEED,
} from "../util/selection_names";
import { changeUserSelection } from "../store";
import { COUNTRY_CODE } from "../util/country_code";
import { CONTINENT_CODE } from "../util/contient_code";
import { ItemDataType } from "rsuite/CascadeTree";

function ExtremeWeatherHeaderDropDown() {
    const dispatch = useDispatch();
    const [userSelection, setUserSelection] = useState({
        weather: WIND_SPEED,
        scope: GLOBAL,
        code: {},
    });
    const [weatherActive, setWeatherActive] = useState({
        WIND_SPEED: true,
        WIND_GUST: false,
        VISIBILITY: false,
        BARO: false,
        TEMPERATURE: false,
    });
    // eslint-disable-next-line max-len
    const [scopeActive, setScopeActive] = useState({
        GLOBAL: true,
        COUNTRY: false,
        CONTINENT: false,
    });
    const [showDropDown, setShowDropDown] = useState(false);

    useEffect(() => {
        // setup default country/continent code when switching between 'Country' or 'Continent'
        if (userSelection.scope === COUNTRY && Object.keys(userSelection.code).length === 0) {
            const updatedState = {
                ...userSelection,
                code: { value: "ca" },
            };
            setUserSelection(updatedState);
        } else if (
            userSelection.scope === CONTINENT &&
            Object.keys(userSelection.code).length === 0
        ) {
            const updatedState = {
                ...userSelection,
                code: { value: "na" },
            };
            setUserSelection(updatedState);
        }
        dispatch(changeUserSelection(userSelection));
    }, [userSelection, dispatch]);

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

    const handleSelectChange = (_, item: ItemDataType) => {
        const updatedSelection = {
            ...userSelection,
            code: { ...item },
        };
        setUserSelection(updatedSelection);
    };

    let renderedDropDown: JSX.Element;

    if (showDropDown && userSelection.scope === COUNTRY) {
        renderedDropDown = (
            <InputPicker
                data={COUNTRY_CODE}
                labelKey={"label"}
                valueKey={"value"}
                onSelect={(value, item) => handleSelectChange(value, item)}
                style={{ width: 120 }}
                placeholder="Select Country"
            />
        );
    } else if (showDropDown && userSelection.scope === CONTINENT) {
        renderedDropDown = (
            <InputPicker
                data={CONTINENT_CODE}
                onSelect={(value, item) => handleSelectChange(value, item)}
                style={{ width: 120 }}
                placeholder="Select Continent"
            />
        );
    }

    return (
        <div className="text-sm flex items-center justify-center p-3 gap-2">
            <Dropdown title={userSelection.weather.replace("_", " ")}>
                <Dropdown.Item
                    onSelect={() => handleWeatherButtonClick(WIND_SPEED)}
                    active={weatherActive.WIND_SPEED}
                >
                    Wind Speed
                </Dropdown.Item>
                <Dropdown.Item
                    onSelect={() => handleWeatherButtonClick(WIND_GUST)}
                    active={weatherActive.WIND_GUST}
                >
                    Wind Gust
                </Dropdown.Item>
                <Dropdown.Item
                    onSelect={() => handleWeatherButtonClick(VISIBILITY)}
                    active={weatherActive.VISIBILITY}
                >
                    Visibility
                </Dropdown.Item>
                <Dropdown.Item
                    onSelect={() => handleWeatherButtonClick(BARO)}
                    active={weatherActive.BARO}
                >
                    Baro
                </Dropdown.Item>
                <Dropdown.Item
                    onSelect={() => handleWeatherButtonClick(TEMPERATURE)}
                    active={weatherActive.TEMPERATURE}
                >
                    Temperature
                </Dropdown.Item>
            </Dropdown>

            <Dropdown title={userSelection.scope}>
                <Dropdown.Item
                    onSelect={() => handleScopeButtonClick(GLOBAL)}
                    active={scopeActive.GLOBAL}
                >
                    Global
                </Dropdown.Item>
                <Dropdown.Item
                    onSelect={() => handleScopeButtonClick(COUNTRY)}
                    active={scopeActive.COUNTRY}
                >
                    Country
                </Dropdown.Item>
                <Dropdown.Item
                    onSelect={() => handleScopeButtonClick(CONTINENT)}
                    active={scopeActive.CONTINENT}
                >
                    Continent
                </Dropdown.Item>
            </Dropdown>
            <div>{renderedDropDown}</div>
        </div>
    );
}

export default ExtremeWeatherHeaderDropDown;

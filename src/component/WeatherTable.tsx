import React, { useEffect, useState } from "react";
import { Table } from "rsuite";
import { useSelector } from "react-redux";
import { RootState, useFetchWeatherMetarsQuery } from "../store";
import { Weather } from "../types";
import {
    BARO,
    TEMPERATURE, VISIBILITY, WIND_GUST, WIND_SPEED,
} from "../util/selection_names";
import GeneralLoading from "./GeneralLoading";
import useIsTouchScreen from "../hooks/useIsTouchScreen";
import ExtremeWeatherTableModal from "./ExtremeWeatherTable_Modal";

interface Props {
    requestNumber: number;
    tableHeight: number;
    darkTheme: boolean;
}

const {
    Column,
    HeaderCell,
    Cell
} = Table;
const rowKey = "icao";

const WeatherTable = ({
    requestNumber,
    tableHeight,
    darkTheme
}: Props) => {
    const isTouchScreen = useIsTouchScreen();
    const {
        weather,
        scope,
        code
    } = useSelector((state: RootState) => state.extremeWeather.userSelection);

    // default to asc order
    const [sortOrder, setSortOrder] = useState(1);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestParams, setRequestParams] = useState<{ limit: number, sort: number }>({
        limit: requestNumber,
        sort: sortOrder
    });

    /*
    * If screen width is below 640, do not render Airport Name column
    * */
    useEffect(() => {
        const detectIfSmallScreen = () => {
            const rootWidth = document.getElementById("root")?.offsetWidth;
            if (rootWidth <= 640) {
                setIsSmallScreen(true);
            } else {
                setIsSmallScreen(false);
            }
        };
        detectIfSmallScreen();
        window.addEventListener("resize", detectIfSmallScreen);

        return () => {
            window.removeEventListener("resize", detectIfSmallScreen);
        };
    }, []);


    /*
    * Change the request params to trigger rtkQuery to make new request
    * */
    useEffect(() => {
        setRequestParams({
            sort: sortOrder,
            limit: requestNumber
        });
    }, [sortOrder, requestNumber]);

    const {
        data: metars,
        error,
        isFetching,
    } = useFetchWeatherMetarsQuery({
        scope,
        weather,
        code,
        params: requestParams,
    }, { refetchOnMountOrArgChange: true });

    // merge new data into exist metars
    const weatherRowData = React.useMemo(() => {
        if (isFetching === false && metars) {
            // add wind data if weather selection is either wind speed or wind gust
            if (weather === WIND_SPEED || weather === WIND_GUST) {
                const tempWeatherRow = metars.data.map((metar: Weather) => {
                    let updatedMetar = {};
                    let gust: number | string = "";
                    if (!metar.wind.gust_kts) {
                        gust = 0;
                    } else {
                        gust = `${metar.wind.gust_kts}`;
                    }

                    const windData = `${metar.wind.degrees}/${metar.wind.speed_kts}${gust !== 0 ? `G${gust}` : ""}`;
                    updatedMetar = {
                        ...metar,
                        name: metar.station.location.name,
                        wind_data: windData,
                        wind_gust_kt: `${gust} Kt`,
                        wind_speed_kt: `${metar.wind.speed_kts} Kt`,
                    };
                    return updatedMetar;
                });
                return tempWeatherRow;
            }
            // add meters to visibility field
            if (weather === VISIBILITY) {
                const tempWeatherRow = metars.data.map((metar: Weather) => {
                    let updatedMetar = {};
                    const updatedVisibility = `${metar.visibility.miles_float} mi / ${metar.visibility.meters_float} m`;
                    updatedMetar = {
                        ...metar,
                        visibility_statute_mi: updatedVisibility,
                        name: metar.station.location.name,
                    };
                    return updatedMetar;
                });
                return tempWeatherRow;
            }
            // add inHg and QNH to baro field
            if (weather === BARO) {
                const tempWeatherRow = metars.data.map((metar: Weather) => {
                    let updatedMetar = {};
                    const updatedBaro = `${metar.barometer.hg} inHg / ${metar.barometer.hpa} QNH`;
                    updatedMetar = {
                        ...metar,
                        altim_in_hg: updatedBaro,
                        name: metar.station.location.name
                    };
                    return updatedMetar;
                });
                return tempWeatherRow;
            }
            // add celsius symbol to temperature field
            if (weather === TEMPERATURE) {
                const tempWeatherRow = metars.data.map((metar: Weather) => {
                    let updatedMetar = {};
                    //const updatedTemp = `${metar.temp_c} ${"\u00b0"}C`;
                    updatedMetar = {
                        ...metar,
                        temp_c: metar.temperature.celsius,
                        name: metar.station.location.name
                    };
                    return updatedMetar;
                });
                return tempWeatherRow;
            }
            return metars.data;
        }
        return [];
    }, [metars, isFetching, error]);


    if (isFetching) {
        return (
            <GeneralLoading themeMode={darkTheme ? "dark" : "light"}/>
        );
    }

    if (error) {
        return <div>Error...</div>;
    }

    /*
    * Render column depends on the user selection
    * Wind Speed -> wind_speed_kt & wind_data
    * Wind Gust -> wind_gust_ket & wind_data
    * Visibility -> visibility_statute_mi
    * Baro -> altim_in_hg
    * Temperature -> temp_c
    * */
    const renderDynamicDataColumn = () => {
        if (weather === WIND_SPEED) {
            return (
                <>
                    <Column flexGrow={1} minWidth={50} align="center">
                        <HeaderCell>Wind Speed</HeaderCell>
                        <Cell dataKey="wind_speed_kt"/>
                    </Column>
                    <Column flexGrow={1} minWidth={80} align="center">
                        <HeaderCell>Wind Data</HeaderCell>
                        <Cell dataKey="wind_data"/>
                    </Column>
                </>
            );
        } else if (weather === WIND_GUST) {
            return (
                <>
                    <Column flexGrow={1} minWidth={50} align="center">
                        <HeaderCell>Wind Gust</HeaderCell>
                        <Cell dataKey="wind_gust_kt"/>
                    </Column>
                    <Column flexGrow={1} minWidth={80} align="center">
                        <HeaderCell>Wind Data</HeaderCell>
                        <Cell dataKey="wind_data"/>
                    </Column>
                </>
            );
        } else if (weather === VISIBILITY) {
            return (
                <>
                    <Column flexGrow={1} align="center">
                        <HeaderCell>Visibility</HeaderCell>
                        <Cell dataKey="visibility_statute_mi"/>
                    </Column>
                </>
            );
        } else if (weather === BARO) {
            return (
                <>
                    <Column flexGrow={1} align="center" sortable>
                        <HeaderCell>Baro</HeaderCell>
                        <Cell dataKey="altim_in_hg"/>
                    </Column>
                </>
            );
        } else if (weather === TEMPERATURE) {
            return (
                <>
                    <Column flexGrow={1} minWidth={50} align="center" sortable>
                        <HeaderCell>Temperature</HeaderCell>
                        <Cell dataKey="temp_c"/>
                    </Column>
                </>
            );
        }
    };

    /*
    * handleSortColumn will change the requestParams
    * This will set trkQuery to make a new request with sorted data.
    * We don't sort locally.
    * */
    const handleSortColumn = (sortColumn: "temp_c" | "altim_in_hg") => {
        if (sortColumn === "temp_c" || sortColumn === "altim_in_hg") {
            const newSortOrder = sortOrder * -1;
            setSortOrder(newSortOrder);
            setRequestParams({
                sort: newSortOrder,
                limit: 10
            });
        }
    };

    const handleRowClick = (rowData) => {
        setSelectedRowData(rowData);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedRowData(null);
    };

    return (
        <div style={{
            height: `${tableHeight}`,
            width: "100%",
            overflowX: "auto",
            position: "relative",

        }}>
            <Table
                shouldUpdateScroll={false}
                autoHeight={false}
                height={tableHeight}
                data={weatherRowData}
                onRowClick={handleRowClick}
                onSortColumn={handleSortColumn}
                hover={!isTouchScreen}
                rowKey={rowKey}
                virtualized
            >
                <Column width={80} align="center">
                    <HeaderCell>ICAO</HeaderCell>
                    <Cell dataKey="icao"/>
                </Column>

                {/*
                    Conditional render Airport Name column based on the screen width
                */}
                {!isSmallScreen ?
                    <Column flexGrow={2} align="center">
                        <HeaderCell>Airport Name</HeaderCell>
                        <Cell dataKey="station.location.name"/>
                    </Column>
                    : null
                }

                {renderDynamicDataColumn()}
            </Table>
            {(setSelectedRowData) &&
                <ExtremeWeatherTableModal
                    rowData={selectedRowData}
                    open={isModalOpen}
                    onClose={handleModalClose}/>
            }
        </div>
    );
};

export default WeatherTable;
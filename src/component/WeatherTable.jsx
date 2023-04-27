import React, { useState } from "react";
import { useTable } from "react-table";
import { useSelector } from "react-redux";
import { logDOM } from "@testing-library/react";
import {
    BARO,
    TEMPERATURE, VISIBILITY, WIND_GUST, WIND_SPEED,
} from "../util/selection_names";
import { useFetchWeatherMetarsQuery } from "../store";
import Skeleton from "./Skeleton";

const INHG_TO_HPA = 33.863886666667;

function WeatherTable() {
    let columnsToRender;
    let requestParams = { limit: 10 };
    const [sortOrder, setSortOrder] = useState(1);
    const { weather, scope, code } = useSelector((state) => state.extremeWeather.userSelection);
    if (weather === TEMPERATURE || weather === BARO) {
        requestParams = { ...requestParams, sort: sortOrder };
    }
    
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
    
    const weatherColumn = [
        { Header: "ICAO", accessor: "station_id" },
        { Header: "Airport Name", accessor: "name" },
        { Header: "Temperature", accessor: "temp_c" },
        { Header: "Wind Speed", accessor: "wind_speed_kt" },
        { Header: "Wind Gust", accessor: "wind_gust_kt" },
        { Header: "Visibility", accessor: "visibility_statute_mi" },
        { Header: "Baro", accessor: "altim_in_hg" },
        { Header: "City", accessor: "municipality" },
    ];
    
    if (weather === WIND_SPEED) {
        columnsToRender = weatherColumn.filter((header) => (header.Header === "Wind Speed" || header.Header === "ICAO" || header.Header === "Airport Name"));
        columnsToRender.push({ Header: "Wind Data", accessor: "wind_data" });
    } else if (weather === WIND_GUST) {
        columnsToRender = weatherColumn.filter((header) => (header.Header === "Wind Gust" || header.Header === "ICAO" || header.Header === "Airport Name"));
        columnsToRender.push({ Header: "Wind Data", accessor: "wind_data" });
    } else if (weather === VISIBILITY) {
        columnsToRender = weatherColumn.filter((header) => (header.Header === "Visibility" || header.Header === "ICAO" || header.Header === "Airport Name"));
    } else if (weather === BARO) {
        columnsToRender = weatherColumn.filter((header) => (header.Header === "Baro" || header.Header === "ICAO" || header.Header === "Airport Name"));
    } else if (weather === TEMPERATURE) {
        columnsToRender = weatherColumn.filter((header) => (header.Header === "Temperature" || header.Header === "ICAO" || header.Header === "Airport Name"));
    }
    
    const columns = React.useMemo(() => columnsToRender, [weather]);
    const weatherRow = React.useMemo(() => {
        if (isFetching === false && metars) {
            // add wind data if weather selection is either wind speed or wind gust
            if (weather === WIND_SPEED || weather === WIND_GUST) {
                const tempWeatherRow = metars.data.map((metar) => {
                    let updatedMetar = {};
                    let gust = "";
                    if (metar.wind_gust_kt !== 0) {
                        gust = `G${metar.wind_gust_kt}`;
                    }
                    
                    const windData = `${metar.wind_dir_degrees}/${metar.wind_speed_kt}${gust.length !== 0 ? gust : gust}`;
                    updatedMetar = {
                        ...metar,
                        wind_data: windData,
                        wind_gust_kt: `${metar.wind_gust_kt} Kt`,
                        wind_speed_kt: `${metar.wind_speed_kt} Kt`,
                    };
                    return updatedMetar;
                });
                return tempWeatherRow;
            }
            // add meters to visibility field
            if (weather === VISIBILITY) {
                const tempWeatherRow = metars.data.map((metar) => {
                    let updatedMetar = {};
                    const updatedVisibility = `${metar.visibility_statute_mi} mi / ${Math.round(metar.visibility_statute_mi * 1609)} m`;
                    updatedMetar = { ...metar, visibility_statute_mi: updatedVisibility };
                    return updatedMetar;
                });
                return tempWeatherRow;
            }
            // add inHg and QNH to baro field
            if (weather === BARO) {
                const tempWeatherRow = metars.data.map((metar) => {
                    let updatedMetar = {};
                    const updatedBaro = `${metar.altim_in_hg.toFixed(2)} inHg / ${Math.round(metar.altim_in_hg * INHG_TO_HPA)} QNH`;
                    updatedMetar = { ...metar, altim_in_hg: updatedBaro };
                    return updatedMetar;
                });
                return tempWeatherRow;
            }
            // add celsius symbol to temperature field
            if (weather === TEMPERATURE) {
                const tempWeatherRow = metars.data.map((metar) => {
                    let updatedMetar = {};
                    const updatedTemp = `${metar.temp_c} ${"\u00b0"}C`;
                    updatedMetar = { ...metar, temp_c: updatedTemp };
                    return updatedMetar;
                });
                return tempWeatherRow;
            }
            return metars.data;
        }
        return [];
    }, [metars, isFetching, error]);
    
    const tableInstance = useTable({ columns, data: weatherRow });
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;
    
    if (isFetching) {
        return <Skeleton className="h-8 w-auto" times={10} />;
    }
    if (error) {
        return <div>Error</div>;
    }
    
    const handleSortClick = () => {
        console.log("click");
        setSortOrder(Number(sortOrder) * -1);
    };
    
    return (
        <table
            {...getTableProps()}
            className="border rounded-xl w-[960px] p-5"
        >
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => {
                            if (column.Header === "Baro") {
                                return (
                                    <th
                                        {...column.getHeaderProps()}
                                        className="text-xl p-2 border-5 bg-red-300"
                                        onClick={handleSortClick}
                                    >
                                        {column.render("Header")}
                                    </th>
                                );
                            }
                        
                            if (column.Header === "Temperature") {
                                return (
                                    <th
                                        {...column.getHeaderProps()}
                                        className="text-xl p-2 border-5 bg-red-300"
                                        onClick={handleSortClick}
                                    >
                                        {column.render("Header")}
                                    </th>
                                );
                            }
                        
                            return (
                                <th
                                    {...column.getHeaderProps()}
                                    className="text-xl p-2 border-5 bg-red-300"
                                >
                                    {column.render("Header")}
                                </th>
                            );
                        })}
                        )
                    </tr>
                ))}
            </thead>
            <tbody
                {...getTableBodyProps()}
                className="[&>*:nth-child(odd)]:bg-blue-300 [&>*:nth-child(even)]:bg-orange-200"
            >
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr
                            {...row.getRowProps()}
                            className="rounded border-2 text-xl text-center hover:bg-gray-200"
                        >
                            {row.cells.map((cell) => (
                                <td
                                    {...cell.getCellProps()}
                                    className="p-5"
                                >
                                    {cell.render("Cell")}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default WeatherTable;

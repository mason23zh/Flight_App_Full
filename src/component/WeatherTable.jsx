import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import { useSelector } from "react-redux";
import {
    BARO,
    TEMPERATURE, VISIBILITY, WIND_GUST, WIND_SPEED,
} from "../util/selection_names";
import { useFetchWeatherMetarsQuery } from "../store";

function WeatherTable() {
    let columnsToRender;
    const [fetchedWeatherData, setFetchedWeatherData] = useState([]);
    const { weather, scope, code } = useSelector((state) => state.extremeWeather.userSelection);
    const {
        data: metars,
        error,
        isFetching,
    } = useFetchWeatherMetarsQuery({ scope, weather, code }, { refetchOnMountOrArgChange: true });
    
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
    } else if (weather === WIND_GUST) {
        columnsToRender = weatherColumn.filter((header) => (header.Header === "Wind Gust" || header.Header === "ICAO" || header.Header === "Airport Name"));
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
        return <div>Is Loading....</div>;
    }
    if (error) {
        return <div>Error</div>;
    }
    
    
    return (
        <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th
                                {...column.getHeaderProps()}
                                style={{
                                    borderBottom: "solid 3px red",
                                    background: "aliceblue",
                                    color: "black",
                                    fontWeight: "bold",
                                }}
                            >
                                {column.render("Header")}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <td
                                    {...cell.getCellProps()}
                                    style={{
                                        padding: "10px",
                                        border: "solid 1px gray",
                                        background: "papayawhip",
                                    }}
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

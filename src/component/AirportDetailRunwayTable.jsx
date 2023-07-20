import React, { useEffect, useState } from "react";
import { Table } from "rsuite";

const { Column, HeaderCell, Cell } = Table;


function AirportDetailRunwayTable({ runways, metar }) {
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [weather, setWeather] = useState([]);
    
    const toRadians = (angle) => angle * (Math.PI / 180);
    
    useEffect(() => {
        if (metar.length !== 0) {
            setWeather(metar);
        }
    }, [metar]);
    
    const renderWindComponent = (runwayHdg) => {
        let headWindComponent;
        let crossWindComponent;
        if (weather.length !== 0) {
            const windDegrees = weather[0].wind.degrees;
            const windSpeed = weather[0].wind.speed_kts;
            const crossWind = Math.round(Math.sin(toRadians(Number(runwayHdg) - Number(windDegrees))) * Number(windSpeed));
            const headWind = Math.round(Math.cos(toRadians(Number(runwayHdg) - Number(windDegrees))) * Number(windSpeed));
            if (crossWind <= 0) {
                crossWindComponent = `L${-crossWind}`;
            } else if (crossWind > 0) {
                crossWindComponent = `R${crossWind}`;
            }
            
            if (headWind <= 0) {
                headWindComponent = `T${-headWind}`;
            } else if (headWind > 0) {
                headWindComponent = `H${headWind}`;
            }
            
            return (
                <div>{headWindComponent}/{crossWindComponent}</div>
            );
        }
        return (
            <div>N/A</div>
        );
    };
    
    
    const sortData = () => runways.sort((a, b) => {
        if (sortColumn && sortType) {
            const x = a[sortColumn];
            const y = b[sortColumn];
            
            if (sortType === "asc") {
                return x - y;
            }
            return y - x;
        }
        return runways;
    });
    
    const handleColumnSort = (columnToBeSort, typeToBeSort) => {
        setSortColumn(columnToBeSort);
        setSortType(typeToBeSort);
    };
    
    
    return (
        <div>
            <Table
                virtualized
                height={600}
                width={1200}
                data={sortData()}
                bordered
                cellBordered
                autoHeight
                affixHeader
                affixHorizontalScrollbar
                onSortColumn={handleColumnSort}
                sortType={sortType}
                sortColumn={sortColumn}
            >
                <Column width={130} align="center">
                    <HeaderCell>Runway ID</HeaderCell>
                    <Cell dataKey="runway_id" />
                </Column>
                    
                <Column width={130} align="center" sortable>
                    <HeaderCell>Runway Length</HeaderCell>
                    <Cell dataKey="runwayLength" />
                </Column>
                    
                <Column width={130} align="center" resizable sortable>
                    <HeaderCell>Runway Width</HeaderCell>
                    <Cell dataKey="runwayWidth" />
                </Column>
                    
                <Column width={130} align="center" resizable>
                    <HeaderCell>Runway Heading</HeaderCell>
                    <Cell dataKey="runwayHdg" />
                </Column>
                    
                <Column width={100} align="center" resizable>
                    <HeaderCell>ILS Frequency</HeaderCell>
                    <Cell dataKey="ilsFreq" />
                </Column>
                    
                <Column width={200} align="center" resizable>
                    <HeaderCell>Glide Slope Angle</HeaderCell>
                    <Cell dataKey="gsAngle" />
                </Column>
                    
                <Column width={200} align="center" resizable sortable>
                    <HeaderCell>Threshold Elevation</HeaderCell>
                    <Cell dataKey="thresholdElevation" />
                </Column>
                    
                <Column width={200} align="center" resizable sortable>
                    <HeaderCell>Threshold Over fly Alt</HeaderCell>
                    <Cell dataKey="thresholdOverflyAlt" />
                </Column>
                <Column>
                    <HeaderCell>Wind Component</HeaderCell>
                    <Cell>
                        {(rowData) => renderWindComponent(rowData.runwayHdg)}
                    </Cell>
                </Column>
            </Table>
        </div>
    );
}

export default AirportDetailRunwayTable;

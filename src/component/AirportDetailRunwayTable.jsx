import React, { useEffect, useState } from "react";
import { Table } from "rsuite";

const { Column, HeaderCell, Cell } = Table;


function AirportDetailRunwayTable({ runways, metar }) {
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [weather, setWeather] = useState();
    
    const toRadians = (angle) => angle * (Math.PI / 180);
    
    useEffect(() => {
        if (metar) {
            setWeather(metar);
        }
    }, [metar]);
    
    const renderWindComponent = (runwayHdg) => {
        let headWindComponent;
        let crossWindComponent;
        if (weather) {
            const windDegrees = weather?.wind?.degrees;
            const windSpeed = weather?.wind?.speed_kts;
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
                data={sortData()}
                bordered
                cellBordered
                autoHeight
                affixHorizontalScrollbar
                onSortColumn={handleColumnSort}
                sortType={sortType}
                sortColumn={sortColumn}
            >
                <Column width={90} align="center">
                    <HeaderCell>Runway ID</HeaderCell>
                    <Cell dataKey="runway_id" />
                </Column>
                    
                <Column width={130} align="center" sortable>
                    <HeaderCell>Runway Length</HeaderCell>
                    <Cell dataKey="runwayLength" />
                </Column>
                    
                <Column width={130} align="center" sortable>
                    <HeaderCell>Runway Width</HeaderCell>
                    <Cell dataKey="runwayWidth" />
                </Column>
                    
                <Column width={130} align="center">
                    <HeaderCell>Runway Heading</HeaderCell>
                    <Cell dataKey="runwayHdg" />
                </Column>
                    
                <Column width={100} align="center">
                    <HeaderCell>ILS Frequency</HeaderCell>
                    <Cell dataKey="ilsFreq" />
                </Column>
                    
                <Column width={130} align="center">
                    <HeaderCell>Glide Slope Angle</HeaderCell>
                    <Cell dataKey="gsAngle" />
                </Column>
                    
                <Column width={170} align="center" sortable>
                    <HeaderCell>Threshold Elevation</HeaderCell>
                    <Cell dataKey="thresholdElevation" />
                </Column>
                    
                <Column width={170} align="center" sortable>
                    <HeaderCell>Threshold Over fly Alt</HeaderCell>
                    <Cell dataKey="thresholdOverflyAlt" />
                </Column>
                    
                <Column width={170} align="center">
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

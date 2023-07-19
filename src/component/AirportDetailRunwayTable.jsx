import React from "react";
import { Table } from "rsuite";

const { Column, HeaderCell, Cell } = Table;


function AirportDetailRunwayTable({ runways }) {
    return (
        <div>
            <Table virtualized height={600} width={1080} data={runways}>
                <Column width={130} align="center" fixed>
                    <HeaderCell>Runway ID</HeaderCell>
                    <Cell dataKey="runway_id" />
                </Column>
                    
                <Column width={130} align="center">
                    <HeaderCell>Runway Length</HeaderCell>
                    <Cell dataKey="runwayLength" />
                </Column>
                    
                <Column width={130} align="center">
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
                    
                <Column width={200} align="center">
                    <HeaderCell>Glide Slope Angle</HeaderCell>
                    <Cell dataKey="gsAngle" />
                </Column>
                    
                <Column width={200} align="center">
                    <HeaderCell>Threshold Elevation</HeaderCell>
                    <Cell dataKey="thresholdElevation" />
                </Column>
                    
                <Column width={200} align="center">
                    <HeaderCell>Threshold Over fly Alt</HeaderCell>
                    <Cell dataKey="thresholdOverflyAlt" />
                </Column>
            </Table>
        </div>
    );
}

export default AirportDetailRunwayTable;

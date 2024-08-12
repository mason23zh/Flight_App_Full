import React, { useState } from "react";
import { Table } from "rsuite";
import {
    HiArrowNarrowDown, HiArrowNarrowLeft, HiArrowNarrowRight, HiArrowNarrowUp,
} from "react-icons/hi";
import AirportDetailRunwayTableIconContext from "./AirportDetailRunwayTable_IconContext";
import { Runway, Weather } from "../types";

const {
    Column,
    HeaderCell,
    Cell
} = Table;

interface Props {
    runways: Array<Runway>;
    metar: Weather;
}

function AirportDetailRunwayTable({
    runways,
    metar
}: Props) {

    const [sortColumn, setSortColumn] = useState<keyof Runway | null>(null);
    const [sortType, setSortType] = useState<"asc" | "desc" | null>(null);

    const toRadians = (angle: number) => angle * (Math.PI / 180);

    const renderWindComponent = (runwayHdg: number) => {
        let headWindComponent: JSX.Element;
        let crossWindComponent: JSX.Element;
        if (metar) {
            const windDegrees = metar?.wind?.degrees;
            const windSpeed = metar?.wind?.speed_kts;
            const crossWind = Math.round(Math.sin(toRadians(Number(runwayHdg) - Number(windDegrees))) * Number(windSpeed));
            const headWind = Math.round(Math.cos(toRadians(Number(runwayHdg) - Number(windDegrees))) * Number(windSpeed));
            if (crossWind <= 0) {
                crossWindComponent = (
                    <div className="rounded-lg p-1 flex items-center gap-1">
                        <div>
                            <div>
                                <AirportDetailRunwayTableIconContext
                                    icon={<HiArrowNarrowLeft/>}
                                    color={{ color: "#4caf50" }}
                                />
                            </div>
                        </div>
                        <div>{-crossWind} kts</div>
                    </div>
                );
            } else if (crossWind > 0) {
                crossWindComponent = (
                    <div className="rounded-lg p-1 flex items-center gap-1">
                        <div>
                            <div>
                                <AirportDetailRunwayTableIconContext
                                    icon={<HiArrowNarrowRight/>}
                                    color={{ color: "#4caf50" }}
                                />
                            </div>
                        </div>
                        <div>{crossWind} kts</div>
                    </div>
                );
            }


            if (headWind <= 0) {
                headWindComponent = (
                    <div className="rounded-lg p-1 flex items-center gap-1">
                        <div>
                            <div>
                                <AirportDetailRunwayTableIconContext
                                    icon={<HiArrowNarrowUp/>}
                                    color={{ color: "#ef5350" }}
                                />
                            </div>
                        </div>
                        <div>{-headWind} kts</div>
                    </div>
                );
            } else if (headWind > 0) {
                headWindComponent = (
                    <div className="rounded-lg p-1 flex items-center gap-1">
                        <div>
                            <div>
                                <AirportDetailRunwayTableIconContext
                                    icon={<HiArrowNarrowDown/>}
                                    color={{ color: "#4caf50" }}
                                />
                            </div>
                        </div>
                        <div>{headWind} kts</div>
                    </div>
                );
            }

            if (headWindComponent && crossWindComponent) {
                return (
                    <div className="flex gap-4 items-center justify-center">
                        <div className="w-[45%]">{headWindComponent}</div>
                        <div className="w-[45%]">{crossWindComponent}</div>
                    </div>
                );
            }
            return (
                <div>N/A</div>
            );
        }
    };

    const sortData = (): Runway[] => {
        if (sortColumn && sortType) {
            return [...runways].sort((a, b) => {
                const x = a[sortColumn];
                const y = b[sortColumn];

                // Handle string sorting
                if (typeof x === "string" && typeof y === "string") {
                    return sortType === "asc" ? x.localeCompare(y) : y.localeCompare(x);
                }

                // Handle numeric sorting
                if (typeof x === "number" && typeof y === "number") {
                    return sortType === "asc" ? x - y : y - x;
                }

                return 0;
            });
        }
        return runways;
    };

    const handleColumnSort = (column: keyof Runway, type: "asc" | "desc") => {
        setSortColumn(column);
        setSortType(type);
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
                    <Cell dataKey="runway_id"/>
                </Column>

                <Column width={130} align="center" sortable>
                    <HeaderCell>Runway Length</HeaderCell>
                    <Cell dataKey="runwayLength"/>
                </Column>

                <Column width={130} align="center" sortable>
                    <HeaderCell>Runway Width</HeaderCell>
                    <Cell dataKey="runwayWidth"/>
                </Column>

                <Column width={130} align="center">
                    <HeaderCell>Runway Heading</HeaderCell>
                    <Cell dataKey="runwayHdg"/>
                </Column>

                <Column width={100} align="center">
                    <HeaderCell>ILS Frequency</HeaderCell>
                    <Cell dataKey="ilsFreq"/>
                </Column>

                <Column width={130} align="center">
                    <HeaderCell>Glide Slope Angle</HeaderCell>
                    <Cell dataKey="gsAngle"/>
                </Column>

                <Column width={170} align="center" sortable>
                    <HeaderCell>Threshold Elevation</HeaderCell>
                    <Cell dataKey="thresholdElevation"/>
                </Column>

                <Column width={170} align="center" sortable>
                    <HeaderCell>Threshold Over fly Alt</HeaderCell>
                    <Cell dataKey="thresholdOverflyAlt"/>
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

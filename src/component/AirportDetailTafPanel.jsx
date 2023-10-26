import React from "react";
import "../styles.css";
import { Panel } from "rsuite";
import moment from "moment";
import _ from "lodash";

function AirportDetailTafPanel({
    forecast, icao, raw_text,
}) {
    const renderTimeSection = (fromTime, toTime) => {
        const from = new Date(fromTime * 1000).toUTCString();
        const to = new Date(toTime * 1000).toUTCString();
        
        
        const fromUTC = moment(from).format("HHmm");
        const toUTC = moment(to).format("HHmm");
        const fromDate = moment(from).format("D MMM YYYY");
        const toDate = moment(to).format("D MMM YYYY");
        
        if (fromDate === toDate) {
            return (
                <div>
                    {fromUTC} to {toUTC} UTC {fromDate}
                </div>
            );
        }
        return (
            <div>
                {fromUTC} UTC {fromDate} to {toUTC} UTC {toDate}
            </div>
        );
    };
    
    const renderForecastType = (fcstType, fromTime, toTime) => {
        if (!fcstType) {
            return (
                <div>
                    FROM:standard forecast or significant change
                </div>
            );
        }
        
        if (fcstType.code === "FM") {
            return (
                <div>
                    {fcstType.text}:{fcstType.description}
                </div>
            );
        }
        
        if (fcstType.code === "TEMPO") {
            return (
                <div>
                    {fcstType.text}:{fcstType.description}
                </div>
            );
        }
        
        if (fcstType.code === "BECMG") {
            const to = new Date(toTime * 1000).toUTCString();
            const toUTC = moment(to).format("HHmm");
            const toDate = moment(to).format("D MMM YYYY");
            return (
                <div>
                    {fcstType.text}:{`Condition expected to become as follows by ${toUTC} UTC ${toDate}`}
                </div>
            );
        }
    };
    
    const renderWind = (wind) => {
        const windDir = wind.windDirection || null;
        const windSpd = wind.windSpeedKt || null;
        const windGust = wind.windGustKt || null;
        return (
            <div>
                {windDir} degrees
                at {windSpd} Kts {windGust ? `Gust ${windGust} kts` : ""}
            </div>
        );
    };
    
    const renderClouds = (skyCondition) => {
        let renderCloudsLayers;
        if (!skyCondition || skyCondition.length === 0) {
            renderCloudsLayers = "";
        } else {
            renderCloudsLayers = skyCondition.map((cloud) => {
                if (cloud.cloudCode === "CAVOK" || cloud.cloudCode === "NCD" || cloud.cloudCode === "SKC") {
                    return (
                        <div className="flex flex-col" key={`${cloud.cloudCode}${cloud.cloudText}`}>
                            <div>
                                {cloud.cloudCode}
                            </div>
                        </div>
                    );
                }
                if (cloud.cloudCode === "OVX") {
                    return (
                        <div className="flex flex-col" key={`${cloud.cloudCode}${cloud.cloudText}`}>
                            <div>
                                {cloud.cloudText}
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="flex flex-col" key={`${cloud.name}${cloud.cloudBaseAgl}`}>
                        <div>
                            {cloud.cloudText} clouds at {cloud.cloudBaseAgl} feet AGL
                        </div>
                    </div>
                );
            });
        }
        return renderCloudsLayers;
    };
    
    const renderWeather = (weather) => {
        let renderedWeather;
        if (!weather || weather.length === 0) {
            renderedWeather = "";
        } else {
            renderedWeather = weather.map((condition) => (
                <div key={condition.code}>
                    <div>
                        {condition.code} ({condition.text})
                    </div>
                </div>
            ));
        }
        return renderedWeather;
    };
    
    const renderForecast = forecast.map((f) => (
        <div className="border rounded-lg" key={Math.random(f.from)}>
            <div className="text-center">
                {renderTimeSection(f.from, f.to)}
            </div>
                
            {f.forecastType ? (
                <div className="grid grid-cols-2 m-2">
                    <div className="text-left sm:text-center">
                        Forecast type:
                    </div>
                    <div className="text-right sm:text-center">
                        {renderForecastType(f.forecastType, f.from, f.to)}
                    </div>
                </div>
            ) : <></>}
                
            {(f.wind && !_.isEmpty(f.wind)) ? (
                <div className="grid grid-cols-2 m-2">
                    <div className="text-left sm:text-center">
                        Winds:
                    </div>
                    <div className="text-right sm:text-center">
                        {renderWind(f.wind)}
                    </div>
                </div>
            ) : <></>}
                
            {f.visibility ? (
                <div className="grid grid-cols-2 m-2">
                    <div className="text-left sm:text-center">
                        Visibility:
                    </div>
                    <div className="text-right sm:text-center">
                        {f.visibilityMile} sm
                    </div>
                </div>
            ) : <></>}
            <div className="grid grid-cols-2 m-2">
                <div className="text-left sm:text-center">Cloud:</div>
                <div className="text-right sm:text-center">{renderClouds(f.skyCondition)}</div>
            </div>
            {
                f.weather && f.weather.length > 0
                    ? (
                        <div className="grid grid-cols-2 m-2">
                            <div className="text-left sm:text-center">
                                Conditions:
                            </div>
                            <div>
                                {renderWeather(f.weather)}
                            </div>
                        </div>
                    ) : <></>
            }
        </div>
    ));
    
    return (
        <div>
            <Panel header={raw_text} collapsible bordered>
                {renderForecast}
            </Panel>
        </div>
    );
}

export default AirportDetailTafPanel;

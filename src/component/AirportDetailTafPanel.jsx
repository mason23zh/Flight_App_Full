import React from "react";
import "../styles.css";
import { Panel } from "rsuite";
import moment from "moment";

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
            const renderWeatherCondition = weather.map((condition) => (
                <div className="flex flex-col" key={condition.code}>
                    <div>
                        code: {condition.code}
                    </div>
                    <div>
                        text: {condition.text}
                    </div>
                </div>
            ));
            
            renderedWeather = (
                <div className="grid grid-cols-2">
                    {/* <div className="text-left sm:text-center">Weather:</div> */}
                    <div className="text-right sm:text-center">{renderWeatherCondition}</div>
                </div>
            );
        }
        return renderedWeather;
    };
    
    
    forecast.forEach((f) => {
        console.log(f);
    });
    const renderForecast = forecast.map((f) => (
        <div className="grid grid-cols-1 border rounded-lg">
            <div className="flex gap-1 justify-center">
                <div>Forecast period:</div>
                {renderTimeSection(f.from, f.to)}
            </div>
            <div className="flex gap-1 justify-center">
                <div>
                    Forecast type:
                </div>
                {renderForecastType(!f.forecastType ? null : f.forecastType, f.from, f.to)}
            </div>
            <div className="flex gap-1 justify-center">
                <div>
                    Winds:
                </div>
                {renderWind(f.wind)}
            </div>
            <div className="flex gap-1 justify-center">
                <div>Clouds:</div>
                {renderClouds(f.skyCondition)}
            </div>
            {
                f.weather !== null ? (
                    <div className="flex gap-1 justify-center">
                        <div>
                            Conditions:
                        </div>
                        {renderWeather(!f.weather ? null : f.weather)}
                    </div>
                ) : ""
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

import React from "react";
import "../styles.css";
import { Panel } from "rsuite";

function AirportDetailWeatherPanel({
    raw_text,
    flightCategory,
    temperature,
    dewpoint,
    barometer,
    clouds,
    conditions,
    humidity,
    wind,
    visibility,
}) {
    let renderWeatherCondition;
    if (conditions.length > 0) {
        renderWeatherCondition = conditions.map((condition) => (
            <div className="flex flex-col" key={condition.code}>
                <div>
                    code: {condition.code}
                </div>
                <div>
                    text: {condition.text}
                </div>
            </div>
        ));
    }
    
    let renderWeather;
    if (conditions.length === 0) {
        renderWeather = "";
    } else {
        renderWeather = (
            <div className="grid grid-cols-2 justify-items-center">
                <div>Weather:</div>
                <div>{renderWeatherCondition}</div>
            </div>
        );
    }
    
    const renderCloudsLayers = clouds.map((cloud) => {
        if (cloud.code === "CAVOK") {
            return (
                <div className="flex flex-col" key={`${cloud.code}${cloud.text}`}>
                    <div>
                        {cloud.code}
                    </div>
                </div>
            );
        }
        
        return (
            <div className="flex flex-col" key={`${cloud.name}${cloud.base_feet_agl}`}>
                <div>
                    {cloud.name} clouds at {cloud.base_feet_agl} feet AGL
                </div>
            </div>
        );
    });
    
    return (
        <div>
            <Panel header={raw_text} collapsible bordered>
                <div className="flex flex-col">
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2 justify-items-center ">
                            <div>Temperature:</div>
                            <div>{temperature?.celsius}{"\u00b0"}C ({temperature?.fahrenheit}{"\u00b0"}F)</div>
                        </div>
                    </div>
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2 justify-items-center">
                            <div>Dewpoint:</div>
                            <div>{dewpoint?.celsius}{"\u00b0"}C ({dewpoint?.fahrenheit}{"\u00b0"}F)</div>
                        </div>
                    </div>
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2 justify-items-center">
                            <div>Humidity:</div>
                            <div>{humidity?.percent} %</div>
                        </div>
                    </div>
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2 justify-items-center">
                            <div>Pressure (altimeter):</div>
                            <div>{barometer.hg} inches Hg ({barometer.mb} mb)</div>
                        </div>
                    </div>
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2 justify-items-center">
                            <div>Wind:</div>
                            <div>From
                                the {wind.degrees} degrees
                                at {wind.speed_kts} kts {wind.gust_kts ? `Gust ${wind.gust_kts} kts` : ""}
                            </div>
                        </div>
                    </div>
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2 justify-items-center">
                            <div>Visibility:</div>
                            <div>{visibility.miles_float} miles ({visibility.meters_float} meters)</div>
                        </div>
                    </div>
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2 justify-items-center">
                            <div>Cloud:</div>
                            <div>{renderCloudsLayers}</div>
                        </div>
                    </div>
                    <div className="hover:border-2 rounded-xl">
                        {renderWeather}
                    </div>
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2 justify-items-center">
                            <div>Flight Category:</div>
                            <div>{flightCategory}</div>
                        </div>
                    </div>
                </div>
            </Panel>
        </div>
    );
}

export default AirportDetailWeatherPanel;

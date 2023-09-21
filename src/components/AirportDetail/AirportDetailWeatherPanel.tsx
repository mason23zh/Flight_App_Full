import React from "react";
// import "../styles.css";
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
    expand = false,
}) {
    let renderWeatherCondition;
    if (conditions && conditions.length > 0) {
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
    if (!conditions || conditions?.length === 0) {
        renderWeather = "";
    } else {
        renderWeather = (
            <div className="grid grid-cols-2">
                <div className="text-left sm:text-center">Weather:</div>
                <div className="text-right sm:text-center">{renderWeatherCondition}</div>
            </div>
        );
    }
    
    let renderCloudsLayers;
    if (!clouds || clouds.length === 0) {
        renderCloudsLayers = "";
    } else {
        renderCloudsLayers = clouds.map((cloud) => {
            if (cloud.code === "CAVOK" || cloud.code === "NCD" || cloud.code === "SKC") {
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
    }
    
    
    return (
        <div>
            <Panel header={raw_text} collapsible bordered defaultExpanded={expand}>
                <div className="grid gird-cols-2 text-sm sm:text-lg">
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2 ">
                            <div className="text-left sm:text-center">Temperature:</div>
                            <div className="text-right sm:text-center">{temperature?.celsius}{"\u00b0"}C
                                ({temperature?.fahrenheit}{"\u00b0"}F)
                            </div>
                        </div>
                    </div>
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2">
                            <div className="text-left sm:text-center">Dewpoint:</div>
                            <div className="text-right sm:text-center">{dewpoint?.celsius}{"\u00b0"}C
                                ({dewpoint?.fahrenheit}{"\u00b0"}F)
                            </div>
                        </div>
                    </div>
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2">
                            <div className="text-left sm:text-center">Humidity:</div>
                            <div className="text-right sm:text-center">{humidity?.percent} %</div>
                        </div>
                    </div>
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2">
                            <div className="text-left sm:text-center">Pressure (altimeter):</div>
                            <div className="text-right sm:text-center">{barometer.hg} inches Hg
                                ({barometer.mb} mb)
                            </div>
                        </div>
                    </div>
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2">
                            <div className="text-left sm:text-center">Wind:</div>
                            <div className="text-right sm:text-center">
                                {wind.degrees} degrees
                                at {wind.speed_kts} kts {wind.gust_kts ? `Gust ${wind.gust_kts} kts` : ""}
                            </div>
                        </div>
                    </div>
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2">
                            <div className="text-left sm:text-center">Visibility:</div>
                            <div className="text-right sm:text-center">{visibility.miles_float} miles
                                ({visibility.meters_float} meters)
                            </div>
                        </div>
                    </div>
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2">
                            <div className="text-left sm:text-center">Cloud:</div>
                            <div className="text-right sm:text-center">{renderCloudsLayers}</div>
                        </div>
                    </div>
                    {renderWeather.length !== 0
                        ? (
                            <div className="hover:border-2 rounded-xl">
                                {renderWeather}
                            </div>
                        ) : <></>}
                    <div className="hover:border-2 rounded-xl">
                        <div className="grid grid-cols-2">
                            <div className="text-left sm:text-center">Flight Category:</div>
                            <div className="text-right sm:text-center">{flightCategory}</div>
                        </div>
                    </div>
                </div>
            </Panel>
        </div>
    );
}

export default AirportDetailWeatherPanel;
 

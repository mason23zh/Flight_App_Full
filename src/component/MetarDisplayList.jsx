// noinspection JSUnresolvedVariable

import { useFetchWeatherMetarsQuery } from "../store";
import { useSelector } from "react-redux";
import Skeleton from "./Skeleton";
import Table from "./Table";
import { BARO, TEMPERATURE, VISIBILITY, WIND_GUST, WIND_SPEED } from "../util/selection_names";

const MetarDisplayList = () => {
    const { weather, scope, code } = useSelector((state) => {
        return state.extremeWeather.userSelection;
    });
    const {
        data: metars,
        error,
        isFetching,
    } = useFetchWeatherMetarsQuery({ scope, weather, code }, { refetchOnMountOrArgChange: true });

    let tempConfig = [];
    let config = [
        {
            label: "ICAO",
            render: (metar) => metar.station_id,
        },
        {
            label: "Airport Name",
            render: (metar) => metar.name,
        },
    ];

    if (weather === WIND_SPEED) {
        let tempOne = {
            label: "Wind Speed",
            render: (metar) => metar.wind_speed_kt,
        };

        let tempTwo = {
            label: "Wind Data",
            render: (metar) => {
                let windGust = Number(metar.wind_gust_kt) !== 0 ? `G${metar.wind_gust_kt}` : "";
                return `${metar.wind_dir_degrees}/${metar.wind_speed_kt}${windGust}`;
            },
        };
        tempConfig.push(tempOne, tempTwo);
        config = [...config, ...tempConfig];
    } else if (weather === WIND_GUST) {
        let tempOne = {
            label: "Wind Gust",
            render: (metar) => metar.wind_gust_kt,
        };

        let tempTwo = {
            label: "Wind Data",
            render: (metar) => {
                let windGust = Number(metar.wind_gust_kt) !== 0 ? `G${metar.wind_gust_kt}` : "";
                return `${metar.wind_dir_degrees}/${metar.wind_speed_kt}${windGust}`;
            },
        };
        tempConfig.push(tempOne, tempTwo);
        config = [...config, ...tempConfig];
    } else if (weather === VISIBILITY) {
        let tempOne = {
            label: "Visibility",
            render: (metar) =>
                `${metar.visibility_statute_mi} mi / ${Math.round(metar.visibility_statute_mi * 1609)} m`,
        };
        tempConfig.push(tempOne);
        config = [...config, ...tempConfig];
    } else if (weather === BARO) {
        let tempOne = {
            label: "Baro",
            render: (metar) => metar.altim_in_hg,
        };
        tempConfig.push(tempOne);
        config = [...config, ...tempConfig];
    } else if (weather === TEMPERATURE) {
        let tempOne = {
            label: "Temperature",
            render: (metar) => `${metar.temp_c}°C`,
        };

        let tempTwo = {
            label: "Dewpoint",
            render: (metar) => `${metar.dewpoint_c}°C`,
        };

        tempConfig.push(tempOne, tempTwo);
        config = [...config, ...tempConfig];
    }

    let content;
    if (isFetching) {
        content = <Skeleton className="h-8 w-auto" times={8} />;
    } else if (error) {
        content = <div>ERROR</div>;
    } else {
        content = <Table config={config} data={metars.data} />;
        // content = metars.data.map((metar) => {
        //     return <MetarListItem key={metar.station_id} metar={metar} />;
        // });
    }

    return <div className="p-5 flex flex-col items-center gap-3 justify-center ">{content}</div>;
};

export default MetarDisplayList;

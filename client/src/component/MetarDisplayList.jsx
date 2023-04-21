import { useFetchWeatherMetarsQuery } from "../store";
import MetarListItem from "./MetarListItem";
import { useSelector } from "react-redux";

const MetarDisplayList = () => {
    const { weather, scope, code } = useSelector((state) => {
        return state.extremeWeather.userSelection;
    });
    const {
        data: metars,
        error,
        isFetching,
    } = useFetchWeatherMetarsQuery({ scope, weather, code }, { refetchOnMountOrArgChange: true });
    let content;
    if (isFetching) {
        content = <div>Loading...</div>;
    } else if (error) {
        content = <div>ERROR</div>;
    } else {
        content = metars.data.map((metar) => {
            return <MetarListItem key={metar.station_id} metar={metar} />;
        });
    }

    return <div>{content}</div>;
};

export default MetarDisplayList;

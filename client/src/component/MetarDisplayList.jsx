import { useFetchWeatherMetarsQuery } from "../store";
import { useSelector } from "react-redux";
import MetarListItem from "./MetarListItem";
import Skeleton from "./Skeleton";

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
        content = <Skeleton className="h-8 w-auto" times={8} />;
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

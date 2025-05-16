import { useFetchTafByICAOQuery } from "../store";
import AirportDetailTafPanel from "./AirportDetailTafPanel";

function AirportDetailTafSection({ icao }) {
    const {
        data: tafData,
        error: tafError,
        isFetching: tafFetching,
    } = useFetchTafByICAOQuery({
        icao,
        decode: true,
    });

    if (tafError) {
        return <div>Unable to fetch TAF for {icao.toUpperCase()}</div>;
    }

    if (tafFetching) {
        return <div>Fetching TAF for {icao.toUpperCase()}</div>;
    }

    if (tafData) {
        if (tafData.data && tafData.results !== 0) {
            const { data } = tafData;
            const { forecast, raw_text } = data[0];
            const renderRawText = () => {
                let tempRawText = raw_text;
                if (!raw_text.includes("TAF")) {
                    tempRawText = `TAF ${raw_text}`;
                }
                return <div className="w-[95%]">{tempRawText}</div>;
            };
            return (
                <div className="w-auto">
                    <AirportDetailTafPanel forecast={forecast} raw_text={renderRawText()} />
                </div>
            );
        }
        return <div>TAF Not Available For {icao.toUpperCase()}</div>;
    }
}

export default AirportDetailTafSection;

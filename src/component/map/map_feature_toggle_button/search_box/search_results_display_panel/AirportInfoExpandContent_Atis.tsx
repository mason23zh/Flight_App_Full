import { DetailAirportResponseQuery } from "../../../../../store/apis/airportsApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import AirportInfoExpandContent_AtisElement from "./AirportInfoExpandContet_AtisElement";

interface Props {
    airportData: DetailAirportResponseQuery;
    airportError: FetchBaseQueryError | SerializedError;
    airportFetching: boolean;
}

const AirportInfoExpandContentAtis = ({ airportData, airportError, airportFetching }: Props) => {
    if (airportError) {
        return <div>Unable to Fetching ATIS</div>;
    }

    if (airportFetching) {
        return <div>Loading ATIS...</div>;
    }

    const renderAtisList = (atis: [{ code: string; datis: string }] | [], vatsim: boolean) => {
        if (atis.length === 0) return null;
        return atis.map((a) => {
            return (
                <div key={`${a.code + a.datis}`}>
                    <AirportInfoExpandContent_AtisElement atis={a} vatsim={vatsim} />
                </div>
            );
        });
    };

    const renderAtis = (airportData: DetailAirportResponseQuery) => {
        if (airportData.data && airportData.result !== 0) {
            const vatsimAtis = airportData.data[0].ATIS.vatsim;
            const faaAtis = airportData.data[0].ATIS.faa;

            if (vatsimAtis.length === 0 && faaAtis.length === 0) {
                return <div className="text-center">No ATIS available</div>;
            }

            return (
                <div className="">
                    {vatsimAtis.length > 0 && renderAtisList(vatsimAtis, true)}
                    {faaAtis.length > 0 && renderAtisList(faaAtis, false)}
                </div>
            );
        }
    };

    if (airportData) {
        return <div>{renderAtis(airportData)}</div>;
    }
};

export default AirportInfoExpandContentAtis;

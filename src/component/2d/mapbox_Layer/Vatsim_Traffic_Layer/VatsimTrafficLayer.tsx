import React from "react";
import { useFetchVatsimPilotsDataQuery } from "../../../../store";
import { Marker } from "react-map-gl";
import { IoMdAirplane } from "react-icons/io";

const VatsimTrafficLayer = () => {
    const {
        data: vatsimPilots,
        error: vatsimPilotsError,
        isLoading: vatsimPilotsLoading
    } = useFetchVatsimPilotsDataQuery(undefined, { pollingInterval: 25000 });

    if (vatsimPilotsError) return null;
    if (vatsimPilotsLoading) {
        return <div>Loading...</div>;
    }

    const renderedTraffic = vatsimPilots.data.pilots.map((pilot) => {
        return (
            <div key={pilot.cid}>
                <Marker longitude={pilot.longitude} latitude={pilot.latitude}>
                    <IoMdAirplane
                        style={{ rotate: `${pilot?.heading || 0}` }}
                    />
                </Marker>
            </div>
        );
    });

    return renderedTraffic;

};

export default VatsimTrafficLayer;
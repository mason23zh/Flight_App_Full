import React from "react";
import { returnOnlineTime } from "../util/calculateOnlineTime";

interface Service {
    airport: { name: string, icao: string },
    callsign: string,
    cid: string,
    coordinates: string[],
    facility: number,
    frequency: string,
    last_updated: string,
    logon_time: string,
    name: string,
    rating: number,
    server: string,
    serviceType: string,
    text_atis: string[],
    visual_range: number,
    atis_code?: string,
}

interface Props {
    serviceData: Service,
    serviceType: string
}

const ControllerPopupContent = ({
    serviceData,
    serviceType
}: Props) => {

    const renderedService = (serviceData: Service, serviceType: string) => {
        let serviceIcon;
        if (serviceType === "GND") {
            serviceIcon = (
                <div className="bg-green-600 rounded-md text-white px-1 py-0 w-[40px] text-center text-xs">
                    GND
                </div>
            );
        } else if (serviceType === "TWR") {
            serviceIcon = (
                <div className="bg-red-600 rounded-md text-white px-1 py-0 w-[40px] text-center text-xs">
                    TWR
                </div>
            );
        } else if (serviceType === "DEL") {
            serviceIcon = (
                <div className="bg-blue-500 rounded-md text-white px-1 py-0 w-[40px] text-center text-xs">
                    DEL
                </div>
            );
        } else if (serviceType === "ATIS") {
            serviceIcon = (
                <div className="grid grid-cols-1 justify-center items-center">
                    <div className="bg-yellow-600 text-white p-1 w-[40px] text-center ">
                        ATIS
                    </div>
                    <div className="p-1 bg-gray-600 text-white w-[40px] text-center">
                        {serviceData.atis_code}
                    </div>
                </div>
            );
        }


        const {
            hour,
            minute
        } = returnOnlineTime(serviceData.logon_time);

        if (serviceType !== "ATIS") {
            return (
                <div className="grid grid-cols-4 w-full font-bold">
                    {serviceIcon}
                    <div className="justify-self-start">
                        {serviceData.callsign}
                    </div>
                    <div className="justify-self-end text-blue-600">
                        {serviceData.frequency}
                    </div>
                    <div className="justify-self-end">
                        {hour}:{minute}
                    </div>
                </div>
            );
        } else if (serviceType === "ATIS") {
            return (
                <div className="grid grid-cols-4 w-full border-1 font-bold">
                    <div className="col-span-1">
                        {serviceIcon}
                    </div>
                    <div className="col-span-3">
                        <div className="grid grid-cols-1">
                            <div className="grid grid-cols-3">
                                <div className="justify-self-start text-center">
                                    {serviceData.callsign}
                                </div>
                                <div className="justify-self-end text-blue-600">
                                    {serviceData.frequency}
                                </div>
                                <div className="justify-self-end">
                                    {hour}:{minute}
                                </div>
                            </div>
                            <div className="w-full font-medium text-xs">
                                {serviceData.text_atis && serviceData.text_atis.length
                                    ? serviceData.text_atis.map((atis) => atis) : ""
                                }
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };


    return (
        renderedService(serviceData, serviceType)
    );
};

export default ControllerPopupContent;
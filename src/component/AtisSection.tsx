import { useEffect, useState } from "react";
import { Panel } from "rsuite";
import { DetailAirportResponseAtis } from "../types";

interface Props {
    ATIS: DetailAirportResponseAtis;
}

function AtisSection({ ATIS }: Props) {
    const [atis, setAtis] = useState<DetailAirportResponseAtis>();
    let renderATIS;

    useEffect(() => {
        setAtis(ATIS);
    }, [ATIS]);

    if (!atis) {
        renderATIS = "Loading ATIS...";
    } else if (atis) {
        let faa: string;
        let faaAtisCode: string;
        let vatsim: string;
        let vatsimAtisCode: string;
        if (atis.faa.length === 0) {
            faa = "FAA ATIS Not Available";
            faaAtisCode = "-";
        } else {
            faa = atis.faa[0].datis;
            faaAtisCode = atis.faa[0].code;
        }

        if (atis.vatsim.length === 0) {
            vatsim = "VATSIM ATIS Not Available";
            vatsimAtisCode = "-";
        } else {
            vatsim = atis.vatsim[0].datis;
            vatsimAtisCode = atis.vatsim[0].code;
        }

        renderATIS = (
            <div>
                <Panel header="ATIS" collapsible bordered>
                    <div className="text-center grid grid-cols-1 gap-2 tex-sm sm:text-lg">
                        <div className="border-2 rounded-xl">
                            <div className="grid grid-cols-1">
                                <div className="flex gap-5 p-2 items-center">
                                    <div className="flex flex-col p-2 ">
                                        <div className="text-sm pb-2">FAA</div>
                                        <div className="bg-yellow-500 text-white p-2 pt-0 pb-0">
                                            ATIS
                                        </div>
                                        <div className="bg-gray-800 text-white p-2">
                                            {faaAtisCode}
                                        </div>
                                    </div>
                                    <div className="text-left text-sm">{faa}</div>
                                </div>
                            </div>
                        </div>
                        <div className="border-2 rounded-xl">
                            <div className="grid grid-cols-1">
                                <div className="flex gap-5 p-2 items-center ">
                                    <div className="flex flex-col p-2">
                                        <div className="text-sm pb-2">VATSIM</div>
                                        <div className="bg-yellow-500 text-white p-2 pt-0 pb-0">
                                            ATIS
                                        </div>
                                        <div className="bg-gray-800 text-white p-2">
                                            {vatsimAtisCode}
                                        </div>
                                    </div>
                                    <div className="text-left text-sm">{vatsim}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Panel>
            </div>
        );
    }
    return <div className="min-w-[150px]">{renderATIS}</div>;
}

export default AtisSection;

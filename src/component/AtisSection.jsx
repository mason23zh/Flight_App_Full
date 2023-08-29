import React, { useEffect, useState } from "react";
import { Panel } from "rsuite";

function AtisSection({ ATIS }) {
    const [atis, setAtis] = useState();
    
    useEffect(() => {
        setAtis(ATIS);
    }, [ATIS]);
    let renderATIS;
    
    if (!atis) {
        renderATIS = "ATIS Not Available";
    } else if (atis) {
        const faa = typeof atis.faa === "string" ? atis.faa : atis.faa[0].datis;
        const faaAtisCode = !atis.faa[0].code ? "-" : atis.faa[0].code;
        const vatsim = !atis.vatsim.datis ? atis.vatsim : atis.vatsim.datis;
        const vatsimAtisCode = !atis.vatsim.code ? "-" : atis.vatsim.code;
        
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
    return (
        <div className="min-w-[150px]">
            {renderATIS}
        </div>
    );
}

export default AtisSection;

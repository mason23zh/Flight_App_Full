interface Props {
    atis: { code: string; datis: string };
    vatsim: boolean;
}

const AirportInfoExpandContent_AtisElement = ({ atis, vatsim }: Props) => {
    return (
        <div className="grid grid-cols-5 p-2 gap-3 ">
            <div className="col-span-1">
                <div className="grid grid-rows-4">
                    <div className="row-span-1 text-sm text-center justify-self-center self-end">
                        {vatsim ? "VATSIM" : "FAA"}
                    </div>
                    <div className="row-span-1 bg-yellow-500 text-white pt-0 pb-0 text-center">
                        ATIS
                    </div>
                    <div className="row-span-2 bg-gray-800 text-white p-2 text-center text-[18px]">
                        {atis.code}
                    </div>
                </div>
            </div>

            <div className="col-span-4">
                <div className="text-left text-sm">{atis.datis}</div>
            </div>
        </div>
    );
};

export default AirportInfoExpandContent_AtisElement;

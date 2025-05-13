import { Panel } from "rsuite";

function AtisPanel({
    faaAtis,
    vatsimAtis
}) {
    return (
        <div className="w-auto">
            <Panel header="ATIS">
                <div className="grid grid-cols-1 text-sm sm:text-lg">
                    <div>
                        {faaAtis}
                    </div>
                    <div>
                        {vatsimAtis}
                    </div>
                </div>
            </Panel>
        </div>
    );
}

export default AtisPanel;
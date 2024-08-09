import React from "react";
import { Modal, Button } from "rsuite";
import SubRowAsync from "./SubRowAsync";

const ExtremeWeatherTableModal = ({
    open,
    onClose,
    rowData
}) => {

    const renderModalTitle = () => {
        if (rowData) {
            return (
                <div className="flex flex-col gap-2 p-1 italic font-Rubik">
                    <div>
                        {rowData.icao}
                    </div>
                    <div>
                        {rowData.name}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Modal.Header>
                    <Modal.Title>{renderModalTitle()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {rowData && <SubRowAsync row={rowData}/>}
                    {/* <Placeholder.Paragraph/> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onClose} appearance="primary">
                        Ok
                    </Button>
                    <Button onClick={onClose} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ExtremeWeatherTableModal;
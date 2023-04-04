import { GoChevronDown, GoChevronLeft } from "react-icons/go";
import { useState } from "react";
import Panel from "./Panel";

const Dropdown = ({ options, onChange, value }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setIsOpen(false);
        onChange(option);
    };

    const renderedOptions = options.map((option) => {
        return (
            <div
                className="hover:bg-sky-100 rounded cursor-pointer p-1"
                onClick={() => handleOptionClick(option)}
                key={option.code}
            >
                {option.name}
            </div>
        );
    });

    return (
        <div className="w-48 flex flex-col">
            <Panel className="flex justify-between items-center cursor-pointer " onClick={handleClick}>
                {value?.name || "Select..."}
                {isOpen ? <GoChevronDown className="text-lg" /> : <GoChevronLeft className="text-lg" />}
            </Panel>
            {isOpen && <Panel className="max-h-80 overflow-scroll ">{renderedOptions}</Panel>}
        </div>
    );
};

export default Dropdown;

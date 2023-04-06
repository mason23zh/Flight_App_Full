import { useEffect, useState, useRef } from "react";
import { GoChevronDown, GoChevronLeft } from "react-icons/go";
import Panel from "./Panel";

const Dropdown = ({ options, onChange, value }) => {
    const [isOpen, setIsOpen] = useState(false);
    // get reference to root element of Dropdown
    const divElement = useRef();

    useEffect(() => {
        const handler = (event) => {
            // if not reference to divElement, return;
            if (!divElement.current) {
                return;
            }
            // if user NOT clicked inside the dropdown, close the dropdown
            if (!divElement.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        // run click during the capture phase
        document.addEventListener("click", handler, true);
        return () => document.removeEventListener("click", handler);
    }, []);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    // performance test
    window.timeTwo = performance.now();
    const handleOptionClick = (option) => {
        window.timeOne = performance.now();
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
        <div ref={divElement} className="w-48 flex flex-col absolute top-[5%]">
            <Panel className="flex justify-between items-center cursor-pointer" onClick={handleClick}>
                {value?.name || "Select..."}
                {isOpen ? <GoChevronDown className="text-lg" /> : <GoChevronLeft className="text-lg" />}
            </Panel>
            <div className="overflow-auto max-h-80">{isOpen && <Panel>{renderedOptions}</Panel>}</div>
        </div>
    );
};

export default Dropdown;

import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { GoChevronDown, GoChevronLeft } from "react-icons/go";
import Panel from "./Panel";

function Dropdown({
    options, onChange, value, className, placeHolderMsg,
}) {
    const dropDownFinalClassName = classNames("w-48 flex flex-col", className);
    
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
    
    
    const handleOptionClick = (option) => {
        setIsOpen(false);
        onChange(option);
    };
    
    const renderedOptions = options.map((option) => (
        <div
            role="presentation"
            className="hover:bg-sky-200 rounded cursor-pointer p-1 duration-50"
            onClick={() => handleOptionClick(option)}
            key={option.code}
        >
            {option.name}
        </div>
    ));
    return (
        <div ref={divElement} className={dropDownFinalClassName}>
            <Panel className="flex justify-between items-center cursor-pointer " onClick={handleClick}>
                {value?.name || (placeHolderMsg?.length !== 0 ? placeHolderMsg : "Select...")}
                {isOpen ? <GoChevronDown className="text-lg" /> : <GoChevronLeft className="text-lg" />}
            </Panel>
            <div className="overflow-auto max-h-80">{isOpen && <Panel>{renderedOptions}</Panel>}</div>
        </div>
    );
}

export default Dropdown;

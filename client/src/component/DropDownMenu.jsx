import { useState } from "react";

const DropDownMenu = ({ options, selected, option }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");

    const handleOptionClick = () => {
        setIsOpen(false);
    };

    const renderedOptions = options.map((item) => {
        return (
            <option onClick={() => handleOptionClick(option)} key={item.code} value={item.code}>
                {item.name}
            </option>
        );
    });

    return (
        <div>
            <select>{renderedOptions}</select>
        </div>
    );
};

export default DropDownMenu;

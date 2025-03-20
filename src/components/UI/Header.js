import { FaUser, FaBars } from "react-icons/fa";
import { useState } from "react";
import FilterMenu from "./FilterMenu";

export default function Header({onFilterChange}) {
    const [isMenuVisible, setIsMenuVisible] = useState(false)

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const closeMenu = () => {
        setIsMenuVisible(false);
    };

    return (
        <header className="bg-[#8CD3EF] p-3 flex justify-between items-center">
            <FaBars className="text-2xl cursor-pointer" onClick={toggleMenu} />
            <h1 className="text-3xl font-roboto font-bold">Holiday Planner</h1>
            <FaUser className="text-2xl" />

            <FilterMenu
                isVisible={isMenuVisible}
                onClose={closeMenu}
                onFilterChange={onFilterChange}
            />
        </header>
    );
}
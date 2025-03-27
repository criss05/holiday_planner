import { FaUser, FaBars } from "react-icons/fa";
import FilterMenu from "./FilterMenu";

export default function Header({onFilterChange, onToggleMenu, isMenuVisible, holidays, setHolidays}) {
    return (
        <header className="bg-[#8CD3EF] p-3 flex justify-between items-center">
            <FaBars className="text-2xl cursor-pointer" onClick={onToggleMenu} />
            <h1 className="text-3xl font-roboto font-bold">Holiday Planner</h1>
            <FaUser className="text-2xl" />

            <FilterMenu
                isVisible={isMenuVisible}
                onFilterChange={onFilterChange}
                holidays={holidays}
                setHolidays={setHolidays}
            />
        </header>
    );
}
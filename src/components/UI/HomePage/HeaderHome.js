import { FaUser, FaBars } from "react-icons/fa";
import FilterMenu from "./FilterMenu"


export default function Header({onFilterChange, onToggleMenu, isMenuVisible, holidays, setHolidays}) {
    return (
        <header className="bg-[#8CD3EF] p-3 flex justify-between items-center" data-testid="header-home">
            <FaBars className="text-2xl cursor-pointer" onClick={onToggleMenu} data-testid="bars-icon"/>
            <h1 className="text-3xl font-roboto font-bold" data-testid="header-home-title">Holiday Planner</h1>
            <FaUser className="text-2xl" data-testid="user-home-icon"/>

            <FilterMenu
                isVisible={isMenuVisible}
                onFilterChange={onFilterChange}
                holidays={holidays}
                setHolidays={setHolidays}
            />
        </header>
    );
}
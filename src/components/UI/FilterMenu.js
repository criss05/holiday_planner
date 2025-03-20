import FilterButton from "./FilterButton";
import { FaBars } from "react-icons/fa";


export default function FilterMenu({ isVisible, onClose, onFilterChange }) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 h-full w-1/4 bg-white shadow-lg z-50">
      <div className="flex flex-col p-6">
        <FaBars className="text-2xl cursor-pointer" onClick={onClose}/>
        <FilterButton
          label="All"
          onClick={() => onFilterChange("All")}
        />
        <FilterButton
          label="Done"
          onClick={() => onFilterChange("Done")}
        />
        <FilterButton
          label="Upcoming"
          onClick={() => onFilterChange("Upcoming")}
        />
      </div>
    </div>
  );
}
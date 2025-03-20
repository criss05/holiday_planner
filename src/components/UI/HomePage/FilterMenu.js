import FilterButton from "./FilterButton";


export default function FilterMenu({ isVisible, onClose, onFilterChange }) {
  if (!isVisible) return null;

  return (
    <div className={`fixed top-15 left-0 h-full w-1/7 bg-[#8ad4f186] shadow-lg z-50 transform transition-transform duration-300 ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
      >
      <div className="flex flex-col p-6 mt-30">
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
import { useState, useMemo } from "react";
import Header from "@/components/UI/HomePage/Header";
import SortDropdown from "@/components/UI/HomePage/SortDropdown";
import HolidayGrid from "@/components/Holidays/HomePage/HolidayGrid";
import initialHolidays from "@/data/Holidays";
import AddButton from "@/components/UI/HomePage/AddButton";
import parseDate from "@/utils/ParseDate";
import { DeleteHoliday } from "@/utils/DeleteHoliday";
import DeletePopup from "@/components/Holidays/HomePage/DeletePopUp";


export default function HolidayPlanner() {
  const [sortBy, setSortBy] = useState("Start Date");
  const [holidays, setHolidays] = useState(initialHolidays);
  const [isDeletePopUpVisible, setIsDeletePopUpVisible] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState(null);
  const [filter, setFilter] = useState("All");
  const [isMenunVisible, setIsMenuVisible] = useState(false);

  const handleDeleteAction = (name) => {
    setHolidayToDelete(name);
    setIsDeletePopUpVisible(true);
  }

  const handleComfirmDelete = (name) => {
    DeleteHoliday(name, holidays, setHolidays)
    setIsDeletePopUpVisible(false);
  }

  const handleCancelDelete = () => {
    setIsDeletePopUpVisible(false);
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  }

  const toggleMenu = () => {
    setIsMenuVisible(!isMenunVisible);
  }

  const filteredHolidays = useMemo(() => {
    switch (filter) {
      case "Done":
        return holidays.filter(holiday => parseDate(holiday.endDate) <= new Date());
      case "Upcoming":
        return holidays.filter(holiday => parseDate(holiday.endDate) >= new Date());
      case "All":
      default:
        return holidays;
    }
  }, [filter, holidays]);

  const sortedHolidays = useMemo(() => {
    return [...filteredHolidays].sort((a, b) => {
      switch (sortBy) {
        case "Start Date":
          return parseDate(a.startDate) - parseDate(b.startDate);
        case "End Date":
          return parseDate(a.endDate) - parseDate(b.endDate);
        case "Destination":
          return a.destination.localeCompare(b.destination);
        case "Name":
          return a.name.localeCompare(b.name);
        case "Transport":
          return a.transport.localeCompare(b.transport);
        default:
          return 0;
      }
    });
  }, [sortBy, filteredHolidays]);


  return (
    <div className="min-h-screen tarnsition-all duration-300">
      {/* Navbar */}
      <Header onFilterChange={handleFilterChange} onToggleMenu={toggleMenu} isMenuVisible={isMenunVisible} />

      {/* Sort Dropdown */}
      <div className={`transition-transform duration-300 ${isMenunVisible ? "ml-50" : "ml-0"}`}>
        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />

        {/* Holiday Cards Grid */}
        <HolidayGrid holidays={sortedHolidays} onDelete={handleDeleteAction} />

        {/* Floating AddButton */}
        <AddButton />
      </div>

      <DeletePopup
        isVisible={isDeletePopUpVisible}
        onClose={handleCancelDelete}
        onDelete={handleComfirmDelete}
        holidayName={holidayToDelete}
      />
    </div>
  );
}

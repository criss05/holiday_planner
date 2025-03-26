import { useState, useMemo } from "react";
import Header from "@/components/UI/HomePage/HeaderHome";
import SortDropdown from "@/components/UI/HomePage/SortDropdown";
import HolidayGrid from "@/components/Holidays/HomePage/HolidayGrid";
import initialHolidays from "@/data/Holidays";
import AddButton from "@/components/UI/HomePage/AddButton";
import parseDate from "@/utils/ParseDate";
import { DeleteHoliday } from "@/utils/DeleteHoliday";
import DeletePopup from "@/components/Holidays/HomePage/DeletePopUp";
import AddPage from "./AddPage";
import EditPage from "./EditPage";
import DetailsPage from "./DetailsPage";


export default function HolidayPlanner() {
  const [sortBy, setSortBy] = useState("Start Date");
  const [holidays, setHolidays] = useState(initialHolidays);
  const [isDeletePopUpVisible, setIsDeletePopUpVisible] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState(null);
  const [filter, setFilter] = useState("All");
  const [isMenunVisible, setIsMenuVisible] = useState(false);
  const [isAddPageVisible, setIsAddPageVisible] = useState(false);
  const [isEditPageVisible, setIsEditPageVisible] = useState(false);
  const [isDetailsPageVisible, setIsDetailsPageVisible] = useState(false);
  const [holidayToEdit, setHolidayToEdit] = useState(null);
  const [holidayToView, setHolidayToView] = useState(null);


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

  const handleAddHoliday = (newHoliday) => {
    setHolidays((prevHolidays) => [...prevHolidays, newHoliday]);
    setIsAddPageVisible(false);
  };


  return (
    <div className="min-h-screen tarnsition-all duration-300">
      {isEditPageVisible ? (
        <EditPage
          holiday={holidayToEdit}
          setIsEditPageVisible={setIsEditPageVisible}
          setHolidays={setHolidays}
        />
      ) : isAddPageVisible ? (
        <AddPage setIsAddPageVisible={setIsAddPageVisible} handleAddHoliday={handleAddHoliday} />
      ) : isDetailsPageVisible ? (
        <DetailsPage
          holiday={holidayToView}
          setIsDetailsPageVisible={setIsDetailsPageVisible}
        />
      ) : (
        <>
          <Header onFilterChange={handleFilterChange} onToggleMenu={toggleMenu} isMenuVisible={isMenunVisible} />
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
          <HolidayGrid
            holidays={sortedHolidays}
            onDelete={handleDeleteAction}
            onEdit={(holiday) => {
              setHolidayToEdit(holiday);
              setIsEditPageVisible(true);
            }}
            onView={(holiday) => {
              setHolidayToView(holiday);
              setIsDetailsPageVisible(true);
            }}
          />
          <AddButton setIsAddPageVisible={setIsAddPageVisible} />
          <DeletePopup isVisible={isDeletePopUpVisible} onClose={handleCancelDelete} onDelete={handleComfirmDelete} holidayName={holidayToDelete} />
        </>
      )}
    </div>
  );
}
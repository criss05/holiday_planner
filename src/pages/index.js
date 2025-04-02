import { useState, useMemo, useEffect } from "react";
import Header from "@/components/UI/HomePage/HeaderHome";
import SortDropdown from "@/components/UI/HomePage/SortDropdown";
import HolidayGrid from "@/components/Holidays/HomePage/HolidayGrid";
import initialHolidays from "@/data/Holidays";
import AddButton from "@/components/UI/HomePage/AddButton";
import DeletePopup from "@/components/Holidays/HomePage/DeletePopUp";
import AddPage from "./AddPage";
import EditPage from "./EditPage";
import DetailsPage from "./DetailsPage";
import Pagination from "@/components/UI/HomePage/Pagination";


export default function HolidayPlanner() {
  const [sortBy, setSortBy] = useState("Start Date");
  const [holidays, setHolidays] = useState(initialHolidays);
  const [isDeletePopUpVisible, setIsDeletePopUpVisible] = useState(false);
  const [holidayToDeleteId, setHolidayToDeleteId] = useState(null);
  const [holidayToDeleteName, setHolidayToDeleteName] = useState(null);
  const [filter, setFilter] = useState("All");
  const [isMenunVisible, setIsMenuVisible] = useState(false);
  const [isAddPageVisible, setIsAddPageVisible] = useState(false);
  const [isEditPageVisible, setIsEditPageVisible] = useState(false);
  const [isDetailsPageVisible, setIsDetailsPageVisible] = useState(false);
  const [holidayToEdit, setHolidayToEdit] = useState(null);
  const [holidayToView, setHolidayToView] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    fetchHolidays();
  }, [filter, sortBy]
  );

  const fetchHolidays = async () => {
    try {
      let url = `http://localhost:5000/holidays?filter=${filter}&sortBy=${sortBy}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch holidays");
      }

      const data = await response.json();
      setHolidays(data);
    }
    catch (error) {
      console.Error("Error fetching the holidays: ", error);
    }
  }

  const handleDeleteAction = (id) => {
    setHolidayToDeleteId(id);
    setHolidayToDeleteName(holidays.find((h) => h.id === id).name);
    setIsDeletePopUpVisible(true);
  }

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/holidays/${holidayToDeleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete holiday");
      }

      fetchHolidays();

      setIsDeletePopUpVisible(false);
    } catch (error) {
      console.error("Error deleting the holiday:", error);
    }
  };


  const handleCancelDelete = () => {
    setIsDeletePopUpVisible(false);
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  }

  const toggleMenu = () => {
    setIsMenuVisible(!isMenunVisible);
  }


  const handleAddHoliday = async (name, destination, startDate, endDate, transport, transport_price, accomodation, accomodation_name, accomodation_price, accomodation_location) => {
    try {
      const response = await fetch("http://localhost:5000/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, destination, startDate, endDate, transport, transport_price, accomodation, accomodation_name, accomodation_price, accomodation_location }),
      });
      if (!response.ok) {
        throw new Error("Failed to add holiday: ");
      }

      fetchHolidays();
    }
    catch (error) {
      console.error("Error adding holiday: ", error);
    }

    setIsAddPageVisible(false);
  };

  const handleUpdateHoliday = async (Id, name, destination, startDate, endDate, transport, transport_price, accomodation, accomodation_name, accomodation_price, accomodation_location) => {
    try {
      const response = await fetch(`http://localhost:5000/holidays/${Id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, destination, startDate, endDate, transport, transport_price, accomodation, accomodation_name, accomodation_price, accomodation_location })
      });

      if (!response.ok) {
        throw new Error("Failed to update holiday");
      }

      fetchHolidays();
    }
    catch (error) {
      console.error("Error updating holiday: ", error);
    }

    setIsEditPageVisible(false);
  };

  const totalPages = Math.ceil(holidays.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHolidays = holidays.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen">
      {isEditPageVisible ? (
        <EditPage
          holiday={holidayToEdit}
          setIsEditPageVisible={setIsEditPageVisible}
          handleUpdateHoliday={handleUpdateHoliday}
        />
      ) : isAddPageVisible ? (
        <AddPage
          setIsAddPageVisible={setIsAddPageVisible}
          handleAddHoliday={handleAddHoliday} />
      ) : isDetailsPageVisible ? (
        <DetailsPage
          holiday={holidayToView}
          setIsDetailsPageVisible={setIsDetailsPageVisible}
        />
      ) : (
        <>
          <Header onFilterChange={handleFilterChange} onToggleMenu={toggleMenu} isMenuVisible={isMenunVisible} holidays={holidays} setHolidays={setHolidays} />
          <div className={`min-h-screen transition-all duration-300 ${isMenunVisible ? 'pl-64' : ''}`}>
            <div className="flex justify-between">
              <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
              <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
            </div>
            <HolidayGrid
              holidays={currentHolidays}
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
          </div>
          <DeletePopup isVisible={isDeletePopUpVisible} onClose={handleCancelDelete} onDelete={handleConfirmDelete} holidayName={holidayToDeleteName} />
        </>
      )
      }
    </div >
  );
}
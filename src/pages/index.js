import { useState, useEffect } from "react";
import Header from "@/components/UI/HomePage/HeaderHome";
import SortDropdown from "@/components/UI/HomePage/SortDropdown";
import HolidayGrid from "@/components/Holidays/HomePage/HolidayGrid";
import AddButton from "@/components/UI/HomePage/AddButton";
import DeletePopup from "@/components/Holidays/HomePage/DeletePopUp";
import AddPage from "./AddPage";
import EditPage from "./EditPage";
import DetailsPage from "./DetailsPage";
import Pagination from "@/components/UI/HomePage/Pagination";
import { getQueue, saveQueue, queueOperation, processQueue } from "@/utils/queue";


export default function HolidayPlanner() {
  const [sortBy, setSortBy] = useState("Start Date");
  const [holidays, setHolidays] = useState([]);
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
  const [isNetworkOnline, setIsNetworkOnline] = useState(true);
  const [isServerOnline, setIsServerOnline] = useState(true);

  useEffect(() => {
    const logConnection = async (type) => {
      try {
        await fetch("http://localhost:5000/log-connection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ type }),
        });

      } catch (error) {
        console.error("Logging error:", error);
      }
    };

    logConnection("connect");

    const handleBeforeUnload = () => {
      navigator.sendBeacon(
        "http://localhost:5000/log-connection",
        JSON.stringify({ type: "disconnect" })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleBeforeUnload();
    };

  }, []);

  useEffect(() => {
    setIsNetworkOnline(navigator.onLine);

    const handleOnline = () => setIsNetworkOnline(true);
    const handleOffline = () => setIsNetworkOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const pingServer = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/holidays`);
        setIsServerOnline(response.ok);
      } catch {
        setIsServerOnline(false);
      }
    };

    pingServer();
    const interval = setInterval(pingServer, 1000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [isNetworkOnline, isServerOnline]);


  useEffect(() => {
    if (isNetworkOnline && isServerOnline) {
      processQueue();
    }
  }, [isNetworkOnline, isServerOnline]
  );


  useEffect(() => {
    fetchHolidays();
  }, [filter, sortBy]
  );

  const fetchHolidays = async () => {
    console.log(isNetworkOnline, isServerOnline);
    if (!isNetworkOnline || !isServerOnline) {
      console.log("You are offline. Skipping fetch.");
      return;
    }

    try {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/holidays?filter=${filter}&sortBy=${sortBy}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch holidays");
      }

      const data = await response.json();
      setHolidays(data);
    } catch (error) {
      console.error("Error fetching the holidays: ", error);
    }
  }

  const handleDeleteAction = (id) => {
    setHolidayToDeleteId(id);
    setHolidayToDeleteName(holidays.find((h) => h.id === id).name);
    setIsDeletePopUpVisible(true);
  }

  const handleConfirmDelete = async () => {
    const isOnline = navigator.onLine && isServerOnline;

    if (isOnline) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/holidays/${holidayToDeleteId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete holiday");

        fetchHolidays();
      } catch (error) {
        console.error("Error deleting holiday (online):", error);
      }
    } else {
      // Queue the delete operation if offline
      queueOperation({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/holidays/${holidayToDeleteId}`,
        body: {},
      });

      // Optimistically remove from local state
      const remainingHolidays = holidays.filter(h => h.id !== holidayToDeleteId);
      setHolidays(remainingHolidays);

      console.log("Offline, operation queued: Delete Holiday");
    }

    setIsDeletePopUpVisible(false);
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


  const handleAddHoliday = async (name, destination, startDate, endDate, transport, transport_price, accommodation, accommodation_name, accommodation_price, accommodation_location) => {
    const body = { name, destination, startDate, endDate, transport, transport_price, accommodation, accommodation_name, accommodation_price, accommodation_location };

    const op = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/holidays`,
      body,
    };

    const isOnline = navigator.onLine && isServerOnline;

    if (isOnline) {
      try {
        const response = await fetch(op.url, {
          method: op.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(op.body),
        });

        if (!response.ok) throw new Error("Failed to add holiday");

        fetchHolidays();
      } catch (error) {
        console.error("Server error, queuing operation...");
        const queue = getQueue();
        queue.push(op);
        saveQueue(queue);
      }
    } else {
      queueOperation({
        method: "POST",
        url: op.url,
        body: op.body,
      });
      console.log("Offline, operation queued: Add Holiday");
    }

    setIsAddPageVisible(false);
  };

  const handleUpdateHoliday = async (id, name, destination, startDate, endDate, transport, transport_price, accommodation, accommodation_name, accommodation_price, accommodation_location) => {
    const updatedHoliday = { name, destination, startDate, endDate, transport, transport_price, accommodation, accommodation_name, accommodation_price, accommodation_location };

    const isOnline = navigator.onLine && isServerOnline;

    if (isOnline) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/holidays/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedHoliday),
        });

        if (!response.ok) throw new Error("Failed to update holiday");

        fetchHolidays();
      } catch (error) {
        console.error("Error updating holiday (online):", error);
      }
    } else {
      // Queue the update operation if offline
      queueOperation({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/holidays/${id}`,
        body: updatedHoliday,
      });
      console.log("Offline, operation queued: Update Holiday");
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
          handleAddHoliday={handleAddHoliday}
          isOnline={navigator.onLine && isServerOnline}
          queueOperation={queueOperation} />
      ) : isDetailsPageVisible ? (
        <DetailsPage
          holiday={holidayToView}
          setIsDetailsPageVisible={setIsDetailsPageVisible}
        />
      ) : (
        <>{!isNetworkOnline && (
          <div className="bg-red-500 text-white text-center p-2">
            You are offline. Changes will be saved when you're back online.
          </div>
        )}

          {isNetworkOnline && !isServerOnline && (
            <div className="bg-yellow-500 text-black text-center p-2">
              Server is unreachable. Actions are queued and will sync later.
            </div>
          )}
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
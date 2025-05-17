import { useState, useEffect, useRef } from "react";
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
import LoginModal from "@/components/UI/Forms/LoginModal";
import RegisterModal from "@/components/UI/Forms/RegisterModal";

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

  const [isLoginModalVisible, setIsLoginModalVisible] = useState(true);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const userIdRef = useRef(null);

  const checkIfAdmin = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/admin-data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": userIdRef.current,
        }
      },);
      if (res.ok) {
        const data = await res.json();
        setIsAdmin(true);
        setAdminData(data);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  }

  useEffect(() => {
    const logConnection = async (type) => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/log-connection`, {
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/log-connection`,
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/holidays/`);
        setIsServerOnline(response.ok);
      } catch {
        setIsServerOnline(false);
      }
    };

    pingServer();
    const interval = setInterval(pingServer, 10000);

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
    if (userIdRef.current) {
      checkIfAdmin();
      fetchHolidays();
    }
  }, [userIdRef.current, filter, sortBy]);

  const fetchHolidays = async () => {
    console.log(isNetworkOnline, isServerOnline);
    if (!isNetworkOnline || !isServerOnline) {
      console.log("You are offline. Skipping fetch.");
      return;
    }
    console.log("userId: ", userIdRef.current);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/holidays?filter=${filter}&sortBy=${sortBy}&user_id=${userIdRef.current}`;

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

  const handleDeleteAction = (holiday_id) => {
    setHolidayToDeleteId(holiday_id);
    console.log(holiday_id);
    console.log(holidayToDeleteId);
    setHolidayToDeleteName(holidays.find((h) => h.holiday_id === holiday_id).holiday_name);
    setIsDeletePopUpVisible(true);
  }

  const handleConfirmDelete = async () => {
    const isOnline = navigator.onLine && isServerOnline;
    console.log(holidayToDeleteId, holidayToDeleteName);
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
      const remainingHolidays = holidays.filter(h => h.holiday_id !== holidayToDeleteId);
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


  const handleAddHoliday = async (holiday_name, holiday_destination, holiday_start_date, holiday_end_date, holiday_transport, holiday_transport_price, holiday_accommodation, holiday_accommodation_name, holiday_accommodation_price, holiday_accommodation_location) => {
    const body = { holiday_name, holiday_destination, holiday_start_date, holiday_end_date, holiday_transport, holiday_transport_price, holiday_accommodation, holiday_accommodation_name, holiday_accommodation_price, holiday_accommodation_location };

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

  const handleUpdateHoliday = async (holiday_id, holiday_name, holiday_destination, holiday_start_date, holiday_end_date, holiday_transport, holiday_transport_price, holiday_accommodation, holiday_accommodation_name, holiday_accommodation_price, holiday_accommodation_location) => {
    const updatedHoliday = { holiday_name, holiday_destination, holiday_start_date, holiday_end_date, holiday_transport, holiday_transport_price, holiday_accommodation, holiday_accommodation_name, holiday_accommodation_price, holiday_accommodation_location };

    const isOnline = navigator.onLine && isServerOnline;

    if (isOnline) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/holidays/${holiday_id}`, {
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
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/holidays/${holiday_id}`,
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

  const generateSpam = async () => {
    try {
      for (let i = 0; i < 500; i++) {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/holidays/100037`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": userIdRef.current,
          },
        });
      }
    }
    catch (error) {
      console.error("Error generating spam:", error);
    }
  }

  if (!userIdRef.current) {
    return (
      <>
        {isLoginModalVisible && (
          <LoginModal
            userIdRef={userIdRef}
            setIsLoginModalVisible={setIsLoginModalVisible}
            setIsRegisterModalVisible={setIsRegisterModalVisible}
          />
        )}
        {isRegisterModalVisible && (
          <RegisterModal
            userIdRef={userIdRef}
            setIsRegisterModalVisible={setIsRegisterModalVisible}
            setIsLoginModalVisible={setIsLoginModalVisible}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen">
      {isAdmin ? (
        <div className="admin-section p-4 bg-gray-100">
          <h2 className="text-2xl font-bold mb-4">Admin Data</h2>
          <table className="w-full bg-white border border-gray-200 rounded-md">
            <thead>
              <tr>
                <th className="border px-4 py-2">User ID</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Monitored At</th>
              </tr>
            </thead>
            <tbody>
              {adminData.map((user) => (
                <tr key={user.user_id}>
                  <td className="border px-4 py-2">{user.user_id}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.monitored_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {/* Existing Non-Admin Page Content */}
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
              queueOperation={queueOperation}
            />
          ) : isDetailsPageVisible ? (
            <DetailsPage
              holiday={holidayToView}
              setIsDetailsPageVisible={setIsDetailsPageVisible}
            />
          ) : (
            <>
              {!isNetworkOnline && (
                <div className="bg-red-500 text-white text-center p-2">
                  You are offline. Changes will be saved when you are back online.
                </div>
              )}

              {isNetworkOnline && !isServerOnline && (
                <div className="bg-yellow-500 text-black text-center p-2">
                  Server is unreachable. Actions are queued and will sync later.
                </div>
              )}
              <Header
                onFilterChange={handleFilterChange}
                onToggleMenu={toggleMenu}
                isMenuVisible={isMenunVisible}
                holidays={holidays}
                setHolidays={setHolidays}
              />
              <div className={`min-h-screen transition-all duration-300 ${isMenunVisible ? "pl-64" : ""}`}>
                <div className="flex justify-between">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                  />
                  <button onClick={generateSpam} className="mt-10 bg-red-500 text-white px-4 py-2 rounded">
                    SPAM
                  </button>
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
              <DeletePopup
                isVisible={isDeletePopUpVisible}
                onClose={handleCancelDelete}
                onDelete={handleConfirmDelete}
                holidayName={holidayToDeleteName}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
import { useState } from "react";
import Header from "@/components/UI/Header";
import InputBox from "@/components/UI/Add&EditPage/InputBox";
import MiddleInputBox from "@/components/UI/Add&EditPage/MiddleInputBox";
import RadioMenu from "@/components/UI/Add&EditPage/RadioMenu";
import Calendar from "@/components/UI/Add&EditPage/Calendar";
import { FaMapMarkedAlt } from "react-icons/fa";
import DoneButton from "@/components/UI/Add&EditPage/DoneButton";
import CancelButton from "@/components/UI/Add&EditPage/CancelButton";


export default function AddPage({
  setIsAddPageVisible,
  handleAddHoliday,
  isOnline, // Whether the user is online
  queueOperation, // Function to queue the operation
}) {
  const transportOptions = ["Car", "Plane", "Train", "Bus", "Ship"];
  const accommodationOptions = [
    "Hotel",
    "Motel",
    "Hostel",
    "Apartment",
    "Cabin",
    "Resort",
    "Villa",
    "Campsite",
  ];

  const [holiday, setHoliday] = useState({
    holiday_name: "",
    holiday_destination: "",
    holiday_start_date: "",
    holiday_end_date: "",
    holiday_transport: "",
    holiday_transport_price: "",
    holiday_accommodation: "",
    holiday_accommodation_name: "",
    holiday_accommodation_price: "",
    holiday_accommodation_location: "",
  });

  const updateHoliday = (field, value) => {
    setHoliday((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValidPrice = (price) => {
    return /^\d+(\.\d{1,2})?$/.test(price); // Allows whole numbers and decimals (e.g., 100 or 99.99)
  };

  const validateForm = () => {
    const {
      holiday_name,
      holiday_destination,
      holiday_start_date,
      holiday_end_date,
      holiday_transport,
      holiday_transport_price,
      holiday_accommodation,
      holiday_accommodation_name,
      holiday_accommodation_location,
      holiday_accommodation_price
    } = holiday;

    if (
      !holiday_name ||
      !holiday_destination ||
      !holiday_start_date ||
      !holiday_end_date ||
      !holiday_transport ||
      !holiday_accommodation ||
      !holiday_accommodation_name ||
      !holiday_accommodation_location
    ) {
      alert("All fields must be filled out.");
      return false;
    }

    if (!isValidPrice(holiday_transport_price) || !isValidPrice(holiday_accommodation_price)) {
      alert("Price fields must be valid numbers.");
      return false;
    }
    if (new Date(holiday_start_date) - new Date(holiday_end_date) > 0) {
      alert("End date cannot be before the start date");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (isOnline) {
        // If online, directly add the holiday
        handleAddHoliday(
          holiday.holiday_name,
          holiday.holiday_destination,
          holiday.holiday_start_date,
          holiday.holiday_end_date,
          holiday.holiday_transport,
          holiday.holiday_transport_price,
          holiday.holiday_accommodation,
          holiday.holiday_accommodation_name,
          holiday.holiday_accommodation_price,
          holiday.holiday_accommodation_location
        );
      } else {
        // If offline, queue the operation
        queueOperation({
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/holidays`,
          body: holiday,
        });
        console.log("Offline, operation queued: Add Holiday");
        setIsAddPageVisible(false);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex flex-col p-20 space-y-10">
        {/* Holiday Name */}
        <div className="grid grid-cols-2 gap-6">
          <label className="text-gray-800 font-semibold text-3xl">Holiday Name:</label>
          <div className="flex items-center bg-blue-100 border border-blue-300 px-3 py-2">
            <InputBox
              value={holiday.holiday_name}
              onChange={(value) => updateHoliday("holiday_name", value)}
              name="holiday_name"
            />
          </div>
        </div>

        {/* Destination */}
        <div className="grid grid-cols-2 gap-6">
          <label className="text-gray-800 font-semibold text-3xl flex items-center">
            Where would you like to travel?
          </label>
          <div className="flex items-center bg-blue-100 border border-blue-300 px-3 py-2">
            <FaMapMarkedAlt className="mr-2 text-2xl" />
            <InputBox
              value={holiday.holiday_destination}
              onChange={(value) => updateHoliday("holiday_destination", value)}
              name="holiday_destination"
            />
          </div>
        </div>

        {/* Transport Type */}
        <div className="grid grid-cols-2 gap-6">
          <label className="text-gray-800 font-semibold text-3xl">
            What type of transport would you like to use?
          </label>
          <div className="flex bg-blue-100 border border-blue-300 px-3 py-2">
            <div className="grid grid-cols-2 gap-25 items-center">
              <div className="pl-8">
                <RadioMenu
                  options={transportOptions}
                  value={holiday.holiday_transport}
                  onChange={(value) => updateHoliday("holiday_transport", value)}
                  name="holiday_transport"
                />
              </div>
              <MiddleInputBox
                text="Price"
                value={holiday.holiday_transport_price}
                onChange={(e) => updateHoliday("holiday_transport_price", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Travel Dates */}
        <div className="grid grid-cols-2 gap-6">
          <label className="text-gray-800 font-semibold text-3xl">
            When would you like to travel?
          </label>
          <div className="flex bg-blue-100 border border-blue-300 px-3 py-2">
            <Calendar
              holiday_start_date={holiday.holiday_start_date}
              holiday_end_date={holiday.holiday_end_date}
              onChange={(dates) => {
                updateHoliday("holiday_start_date", dates.holiday_start_date);
                updateHoliday("holiday_end_date", dates.holiday_end_date);
              }}
              minDate={new Date()}
            />
          </div>
        </div>

        {/* Accommodation Type */}
        <div className="grid grid-cols-2 gap-6">
          <label className="text-gray-800 font-semibold text-3xl">
            What is the type of accommodation you would prefer?
          </label>
          <div className="flex bg-blue-100 border border-blue-300 px-3 py-2">
            <div className="grid grid-cols-2">
              <div className="pl-3">
                <RadioMenu
                  options={accommodationOptions}
                  value={holiday.holiday_accommodation}
                  onChange={(value) => updateHoliday("holiday_accommodation", value)}
                  name="holiday_accommodation"
                />
              </div>
              <div>
                <MiddleInputBox
                  text="Price"
                  value={holiday.holiday_accommodation_price}
                  onChange={(e) => updateHoliday("holiday_accommodation_price", e.target.value)}
                />
                <MiddleInputBox
                  text="Name"
                  value={holiday.holiday_accommodation_name}
                  onChange={(e) => updateHoliday("holiday_accommodation_name", e.target.value)}
                />
                <MiddleInputBox
                  text="Location"
                  value={holiday.holiday_accommodation_location}
                  onChange={(e) => updateHoliday("holiday_accommodation_location", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-start gap-10 pt-4">
          <DoneButton onClick={handleSubmit} />
          <CancelButton onClick={() => setIsAddPageVisible(false)} />
        </div>
      </div>
    </div>
  );
}

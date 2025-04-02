import { useState } from "react";
import Header from "@/components/UI/Header";
import InputBox from "@/components/UI/AddPage/InputBox";
import MiddleInputBox from "@/components/UI/AddPage/MiddleInputBox";
import RadioMenu from "@/components/UI/AddPage/RadioMenu";
import Calendar from "@/components/UI/AddPage/Calendar";
import DoneButton from "@/components/UI/AddPage/DoneButton";
import CancelButton from "@/components/UI/AddPage/CancelButton";
import { FaMapMarkedAlt } from "react-icons/fa";

export default function EditPage({ holiday, setIsEditPageVisible, handleUpdateHoliday }) {
    const [editedHoliday, setEditedHoliday] = useState(holiday);

    const updateHoliday = (field, value) => {
        setEditedHoliday((prev) => ({
            ...prev,
            [field]: value
        }));
    };


    const isValidPrice = (price) => {
        return /^\d+(\.\d{1,2})?$/.test(price);
    };

    const validateForm = () => {
        const {
            name,
            destination,
            startDate,
            endDate,
            transport,
            transport_price,
            accommodation,
            accommodation_name,
            accommodation_price,
            accommodation_location,
        } = editedHoliday;

        if (!name || !destination || !startDate || !endDate || !transport || !accommodation || !accommodation_name || !accommodation_location) {
            alert("All fields must be filled out.");
            return false;
        }

        if (!isValidPrice(transport_price) || !isValidPrice(accommodation_price)) {
            alert("Price fields must be valid numbers.");
            return false;
        }

        if (new Date(startDate) - new Date(endDate) > 0) {
            alert("End date cannot be before the start date" );
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            handleUpdateHoliday(editedHoliday.id
                ,editedHoliday.name,
                editedHoliday.destination,
                editedHoliday.startDate,
                editedHoliday.endDate,
                editedHoliday.transport,
                editedHoliday.transport_price,
                editedHoliday.accommodation,
                editedHoliday.accommodation_name,
                editedHoliday.accommodation_price,
                editedHoliday.accommodation_location);
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
                        <InputBox value={editedHoliday.name}
                            onChange={(value) => updateHoliday("name", value)}
                            name="name"
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
                        <InputBox value={editedHoliday.destination}
                            onChange={(value) => updateHoliday("destination", value)}
                            name="destination"
                        />
                    </div>
                </div>

                {/* Transport Type */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">Transport Type:</label>
                    <div className="flex bg-blue-100 border border-blue-300 px-3 py-2">
                        <div className="grid grid-cols-2 gap-25 items-center">
                            <div className="pl-8">
                                <RadioMenu options={["Car", "Plane", "Train", "Bus", "Ship"]}
                                    value={editedHoliday.transport}
                                    onChange={(value) => updateHoliday("transport", value)}
                                    name="transport" />
                            </div>
                            <MiddleInputBox text="Price"
                                value={editedHoliday.transport_price}
                                onChange={(e) => updateHoliday("transport_price", e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Travel Dates */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">Travel Dates:</label>
                    <div className="flex bg-blue-100 border border-blue-300 px-3 py-2">
                        <Calendar
                            startDate={editedHoliday.startDate}
                            endDate={editedHoliday.endDate}
                            onChange={(dates) => {
                                updateHoliday("startDate", dates.startDate);
                                updateHoliday("endDate", dates.endDate);
                            
                            } }
                            minDate={null}
                        />
                    </div>
                </div>

                {/* Accommodation Type */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">Accommodation Type:</label>
                    <div className="flex bg-blue-100 border border-blue-300 px-3 py-2">
                        <div className="grid grid-cols-2 gap-15">
                            <div className="pl-3">
                                <RadioMenu options={["Hotel", "Motel", "Hostel", "Apartment", "Cabin", "Resort", "Villa", "Campsite"]}
                                    value={editedHoliday.accommodation}
                                    onChange={(value) => updateHoliday("accommodation", value)}
                                    name="accommodation" />
                            </div>
                            <div>
                                <MiddleInputBox
                                    text="Price"
                                    value={editedHoliday.accommodation_price}
                                    onChange={(e) => updateHoliday("accommodation_price", e.target.value)}
                                />
                                <MiddleInputBox
                                    text="Name"
                                    value={editedHoliday.accommodation_name}
                                    onChange={(e) => updateHoliday("accommodation_name", e.target.value)}
                                />
                                <MiddleInputBox
                                    text="Location"
                                    value={editedHoliday.accommodation_location}
                                    onChange={(e) => updateHoliday("accommodation_location", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-start gap-10 pt-4">
                    <DoneButton onClick={handleSubmit} />
                    <CancelButton onClick={() => setIsEditPageVisible(false)} />
                </div>
            </div>
        </div>
    );
}

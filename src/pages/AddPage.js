import { useState } from "react";
import Header from "@/components/UI/Header";
import InputBox from "@/components/UI/AddPage/InputBox";
import MiddleInputBox from "@/components/UI/AddPage/MiddleInputBox";
import RadioMenu from "@/components/UI/AddPage/RadioMenu";
import Calendar from "@/components/UI/AddPage/Calendar";
import { FaMapMarkedAlt } from "react-icons/fa";
import DoneButton from "@/components/UI/AddPage/DoneButton";
import CancelButton from "@/components/UI/AddPage/CancelButton";


export default function AddPage({ setIsAddPageVisible, handleAddHoliday }) {
    const transportOptions = ["Car", "Plane", "Train", "Bus", "Ship"];
    const accommodationOptions = ["Hotel", "Motel", "Hostel", "Apartment", "Cabin", "Resort", "Villa", "Campsite"];

    const [holiday, setHoliday] = useState({
        name: "",
        destination: "",
        startDate: "",
        endDate: "",
        transport: "",
        transport_price: "",
        accommodation: "",
        accommodation_name: "",
        accommodation_price: "",
        accommodation_location: "",
    });

    const updateHoliday = (field, value) => {
        setHoliday((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="min-h-screen">
            <Header />
            <div className="flex flex-col p-20 space-y-10">
                {/* Holiday Name */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">Holiday Name:</label>
                    <div className="flex items-center bg-blue-100 border border-blue-300 px-3 py-2">
                        <InputBox value={holiday.name}
                            onChange={(value) => updateHoliday("name", value)}
                            name="name" />
                    </div>
                </div>

                {/* Destination */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl flex items-center">
                        Where would you like to travel?
                    </label>
                    <div className="flex items-center bg-blue-100 border border-blue-300 px-3 py-2">
                        <FaMapMarkedAlt className="mr-2 text-2xl" />
                        <InputBox value={holiday.destination}
                            onChange={(value) => updateHoliday("destination", value)}
                            name="destination" />
                    </div>
                </div>

                {/* Transport Type */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">What type of transport would you like to use?</label>
                    <div className="flex  bg-blue-100 border border-blue-300 px-3 py-2">
                        <div className="grid grid-cols-2 gap-25 items-center">
                            <div className="pl-8">
                                <RadioMenu options={transportOptions} value={holiday.transport} onChange={(value) => updateHoliday("transport", value)} name="transport"/>
                            </div>
                            <MiddleInputBox text="Price" value={holiday.transport_price} onChange={(e) => updateHoliday("transport_price", e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Travel Dates */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">When would you like to travel?</label>
                    <div className="flex  bg-blue-100 border border-blue-300 px-3 py-2">
                        <Calendar
                            startDate={holiday.startDate}
                            endDate={holiday.endDate}
                            onChange={(dates) => {
                                updateHoliday("startDate", dates.startDate);
                                updateHoliday("endDate", dates.endDate);
                            }}
                        />
                    </div>
                </div>

                {/* Accommodation Type */}
                <div className="grid grid-cols-2 gap-6">
                    <label className="text-gray-800 font-semibold text-3xl">What is the type of accommodation you would prefer?</label>
                    <div className="flex  bg-blue-100 border border-blue-300 px-3 py-2">
                        <div className="grid grid-cols-2">
                            <div className="pl-3">
                                <RadioMenu options={accommodationOptions} value={holiday.accommodation} onChange={(value) => updateHoliday("accommodation", value)} name="accommodetion"/>
                            </div>
                            <div>
                                <MiddleInputBox text="Price" value={holiday.accommodation_price} onChange={(e) => updateHoliday("accommodation_price", e.target.value)} />
                                <MiddleInputBox text="Name" value={holiday.accommodation_name} onChange={(e) => updateHoliday("accommodation_name", e.target.value)} />
                                <MiddleInputBox text="Location" value={holiday.accommodation_location} onChange={(e) => updateHoliday("accommodation_location", e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-start gap-10 pt-4">
                    <DoneButton onClick={() => handleAddHoliday(holiday)} />
                    <CancelButton onClick={() => setIsAddPageVisible(false)} />
                </div>
            </div>
        </div >
    );
}

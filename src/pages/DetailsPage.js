import { useState, useEffect } from "react";
import Header from "@/components/UI/Header";
import InputBox from "@/components/UI/DetailsPage/InputBox";
import MiddleInputBox from "@/components/UI/DetailsPage/MiddleInputBox";
import RadioMenu from "@/components/UI/DetailsPage/RadioMenu";
import Calendar from "@/components/UI/DetailsPage/Calendar";
import BackButton from "@/components/UI/DetailsPage/BackButton";

export default function DetailsPage({ holiday, setIsDetailsPageVisible }) {
    const [holidayDetails, setHolidayDetails] = useState(holiday);

    // Ensure the details are correctly set when the holiday prop changes
    useEffect(() => {
        setHolidayDetails(holiday);
    }, [holiday]);

    return (
        <div className="min-h-screen">
            <Header />  
                <div className="flex flex-col p-20 space-y-10">
                    {/* Holiday Name */}
                    <div className="grid grid-cols-2 gap-6">
                        <label className="text-gray-800 font-semibold text-3xl">Holiday Name:</label>
                        <div className="flex items-center bg-blue-100 border border-blue-300 px-3 py-2">
                            <InputBox className ="invalid:read-only" value={holidayDetails.name} name="name"/>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="grid grid-cols-2 gap-6">
                        <label className="text-gray-800 font-semibold text-3xl flex items-center">
                            Where would you like to travel?
                        </label>
                        <div className="flex items-center bg-blue-100 border border-blue-300 px-3 py-2">
                            <InputBox value={holidayDetails.destination} disabled name="destination" />
                        </div>
                    </div>

                    {/* Transport Type */}
                    <div className="grid grid-cols-2 gap-6">
                        <label className="text-gray-800 font-semibold text-3xl">Transport Type:</label>
                        <div className="flex bg-blue-100 border border-blue-300 px-3 py-2">
                            <div className="grid grid-cols-2 gap-25 items-center">
                                <div className="pl-8">
                                    <RadioMenu options={["Car", "Plane", "Train", "Bus", "Ship"]}
                                        value={holidayDetails.transport}
                                        disabled
                                        name="transport" />
                                </div>
                                <MiddleInputBox text="Price" value={holidayDetails.transport_price} disabled />
                            </div>
                        </div>
                    </div>

                    {/* Travel Dates */}
                    <div className="grid grid-cols-2 gap-6">
                        <label className="text-gray-800 font-semibold text-3xl">Travel Dates:</label>
                        <div className="flex bg-blue-100 border border-blue-300 px-3 py-2">
                            <Calendar
                                startDate={holidayDetails.startDate}
                                endDate={holidayDetails.endDate}
                                disabled
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
                                        value={holidayDetails.accommodation}
                                        disabled
                                        name="accommodation" />
                                </div>
                                <div>
                                    <MiddleInputBox text="Price" value={holidayDetails.accommodation_price} disabled />
                                    <MiddleInputBox text="Name" value={holidayDetails.accommodation_name} disabled />
                                    <MiddleInputBox text="Location" value={holidayDetails.accommodation_location} disabled />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-start gap-10 pt-4">
                        <BackButton onClick={() => setIsDetailsPageVisible(false)} />
                    </div>
                </div>
            </div>
    );
}

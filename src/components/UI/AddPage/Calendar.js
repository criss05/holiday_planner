import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function Calendar({ startDate, endDate }) {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div>
                <label className="block text-gray-700 font-semibold mb-2">Start Date: </label>
                <DatePicker
                    selected={startDate}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    className="p-2 border-2 border-[#A7CFFF] rounded-md w-full"
                />
            </div>
            <div>
                <label className="block text-gray-700 font-semibold mb-2">End Date: </label>
                <DatePicker
                    selected={endDate}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    className="p-2 border-2 border-[#A7CFFF] rounded-md w-full"
                />
            </div>
        </div>
    )
}
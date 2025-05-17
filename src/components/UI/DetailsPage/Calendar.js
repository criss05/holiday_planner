import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function Calendar({ holiday_start_date, holiday_end_date, disabled }) {
    const formatDate = (date) =>
        date ? date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

    return (
        <div className="flex flex-col gap-4 w-full">
            <div>
                <label className="block text-gray-700 font-semibold mb-2">Start Date: </label>
                <DatePicker
                    selected={holiday_start_date ? new Date(holiday_start_date) : null}
                    disabled={disabled}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    className="p-2 border-2 border-[#A7CFFF] rounded-md w-full"
                />
            </div>
            <div>
                <label className="block text-gray-700 font-semibold mb-2">End Date: </label>
                <DatePicker
                    selected={holiday_end_date ? new Date(holiday_end_date) : null}
                    minDate={holiday_start_date ? new Date(holiday_start_date) : new Date()}
                    disabled={disabled}
                    dateFormat="MMMM d, yyyy"
                    className="p-2 border-2 border-[#A7CFFF] rounded-md w-full"
                />
            </div>
        </div>
    )
}
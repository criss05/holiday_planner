import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function Calendar() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            calendarClassName="w-full custom-calendar"
            inline
        />
    )
}
import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";

export default function HolidayCard({ holiday, onDelete, onEdit, onView }) {
    return (
        <div key={holiday.holiday_id} className="bg-[#D3E7FF] shadow-lg flex flex-col justify-between h-64">
            <h2 className="text-xl font-bold bg-[#A7CFFF] text-center py-3">{holiday.holiday_name}</h2>
            <div className="pl-4 pt-2 flex-grow text-lg">
                <p><strong>Destination: </strong>{holiday.holiday_destination}</p>
                <p><strong>Start Date: </strong>{holiday.holiday_start_date}</p>
                <p><strong>End Date: </strong>{holiday.holiday_end_date}</p>
                <p><strong>Transport: </strong>{holiday.holiday_transport}</p>
                <p className={holiday.holiday_transport_price + holiday.holiday_accommodation_price < 500 ? "text-[#da0303]" : holiday.holiday_transport_price + holiday.holiday_accommodation_price < 1000 ? "text-[#a372e4]" : "text-[#0e0ec0]"}><strong>Price: </strong>{holiday.holiday_transport_price + holiday.holiday_accommodation_price < 500 ? '💰' : holiday.tholiday_ransport_price + holiday.holiday_accommodation_price < 1000 ? '💰💰' : '💰💰💰'} {holiday.holiday_transport_price + holiday.holiday_accommodation_price} RON</p>
            </div>
            <div className="flex justify-end gap-4 px-4 pb-10">
                <div className="cursor-pointer bg-[#73DAFF] p-3 rounded-md" onClick={() => onEdit(holiday)}
                    data-testid="edit-button">
                    <FaEdit className=" text-lg" />
                </div>
                <div className="cursor-pointer bg-[#73DAFF] p-3 rounded-md" onClick={() => onDelete(holiday.holiday_id)}
                    data-testid="delete-button">
                    <FaTrash className="text-lg" />
                </div>
                    <div className="cursor-pointer bg-[#73DAFF] p-3 rounded-md" onClick={() => onView(holiday)}
                        data-testid="info-button">
                        <FaInfoCircle className="text-lg" />
                    </div>
            </div>
        </div>
    );
}

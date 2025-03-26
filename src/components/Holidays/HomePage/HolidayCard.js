import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";

export default function HolidayCard({ holiday, onDelete, onEdit, onView }) {
    return (
        <div key={holiday.name} className="bg-[#D3E7FF] shadow-lg flex flex-col justify-between h-64">
            <h2 className="text-xl font-bold bg-[#A7CFFF] text-center py-3">{holiday.name}</h2>
            <div className="p-4 flex-grow text-lg">
                <p><strong>Destination: </strong>{holiday.destination}</p>
                <p><strong>Start Date: </strong>{holiday.startDate}</p>
                <p><strong>End Date: </strong>{holiday.endDate}</p>
                <p><strong>Transport: </strong>{holiday.transport}</p>
            </div>
            <div className="flex justify-end gap-4 px-4 pb-3">
                <div className="cursor-pointer bg-[#73DAFF] p-3 rounded-md" onClick={() => onEdit(holiday)}>
                    <FaEdit className=" text-lg" />
                </div>
                <div className="cursor-pointer bg-[#73DAFF] p-3 rounded-md" onClick={() => onDelete(holiday.name)}>
                    <FaTrash className="text-lg" />
                </div>
                    <div className="cursor-pointer bg-[#73DAFF] p-3 rounded-md" onClick={() => onView(holiday)}>
                        <FaInfoCircle className="text-lg" />
                    </div>
            </div>
        </div>
    );
}

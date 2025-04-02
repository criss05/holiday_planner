import HolidayCard from "./HolidayCard";

export default function HolidayGrid({ holidays, onDelete, onEdit, onView }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 px-25 py-7" 
        data-testid="holiday-grid">
            {holidays.map((holiday) => (
                <HolidayCard key={holiday.id} 
                holiday={holiday} 
                onDelete={onDelete} 
                onEdit={onEdit} 
                onView={onView}
                />
            ))}
        </div>
    );
}

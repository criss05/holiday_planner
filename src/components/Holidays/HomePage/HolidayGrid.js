import HolidayCard from "./HolidayCard";


export default function HolidayGrid({ holidays, onDelete}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 px-25 py-7">
            {holidays.map((holiday) => (
                <HolidayCard holiday={holiday} onDelete={onDelete}/>
            ))}
        </div>
    );
}
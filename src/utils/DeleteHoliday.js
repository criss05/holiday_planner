export const DeleteHoliday = 
    (name, holidays, setHolidays)=>
    {
        const updatedHolidays = holidays.filter((holiday) => holiday.name !== name);
        setHolidays(updatedHolidays);
    }
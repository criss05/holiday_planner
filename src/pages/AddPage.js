import HeaderAdd from "@/components/UI/HeaderAdd"
import InformationFields from "@/components/UI/AddPage/InformationFields";
import { FaMapMarkedAlt } from "react-icons/fa";
import DoneButton from "@/components/UI/AddPage/DoneButton";
import CancelButton from "@/components/UI/AddPage/CancelButton";
import { useState } from "react";


export default function AddPage({ onAddHoliday }) {

    const [holidayName, setHolidayName] = useState("");
    const [destination, setDestination] = useState("");
    const [transport, setTransport] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [accommodation, setAccommodation] = useState("");

    const handleDone = () => {
        // Create a holiday object with the form data
        const newHoliday = {
          name: holidayName,
          destination: destination,
          transport: transport,
          startDate: startDate,
          endDate: endDate,
          accommodation: accommodation,
          activities: activities, // Or any logic to select activities
        };
    
        // Call the onAddHoliday function to save the new holiday
        onAddHoliday(newHoliday);
      };

    return (
        <div className="min-h-screen">
            <HeaderAdd />
            <div className="flex flex-row justify-between h-screen">
                <div className="flex flex-col justify-between p-20">
                    <InformationFields text="Holiday Name" value={holidayName} onChange={setHolidayName} />
                    <InformationFields text="Where would you like to travel?" icon={<FaMapMarkedAlt />} value={destination} onChange={setDestination} />
                    <InformationFields text="What type of transport would you like to use?" value={transport} onChange={setTransport}/>
                    <InformationFields text="When would you like to travel?" value={startDate} onChange={setStartDate} />
                    <InformationFields text="What is the type of accommodation you would prefer?" value={accommodation} onChange={setAccommodation} />
                    <div className="flex justify-left gap-20 pb-10">
                        <DoneButton />
                        <CancelButton />
                    </div>
                </div>
            </div>

        </div>
    );
}
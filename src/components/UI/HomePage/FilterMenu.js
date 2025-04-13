import FilterButton from "./FilterButton";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";
import { generateRandomHolidays } from "@/data/generateHolidays";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);




export default function FilterMenu({ isVisible, onFilterChange, holidays, setHolidays }) {
  if (!isVisible) return null;

  const doneHolidays = useMemo(() => holidays.filter((holiday) => new Date(holiday.holiday_end_date) <= new Date()), [holidays]);
  const upcomingHolidays = useMemo(() => holidays.filter((holiday) => new Date(holiday.holiday_end_date) > new Date()), [holidays]);

  const data = {
    labels: ['Upcoming Holidays', 'Done Holidays'],
    datasets: [
      {
        label: '# of Holidays',
        data: [upcomingHolidays.length, doneHolidays.length],
        backgroundColor: ['#36a2eb', '#ff6384'],
        borderColor: ['#36a2eb', '#ff6384'],
        borderWidth: 1,
      },
    ],
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRandomHolidays = useCallback(() => {
    setIsGenerating((prevState) => !prevState);
  }, []);

  useEffect(() => {
    let interval;

    if (isGenerating) {
      interval = setInterval(() => {
        const newHolidays = generateRandomHolidays(1); 
        setHolidays((prevHolidays) => [...prevHolidays, ...newHolidays]);
      }, 1000); 
    } else {
      clearInterval(interval);
    }


    return () => {
      clearInterval(interval);
    };
  }, [isGenerating, setHolidays]);

  return (
    <div
      className={`fixed top-10 left-0 h-full w-64 bg-[#8ad4f186] shadow-lg z-50 transform transition-all duration-300 ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
      data-testid="filter-menu"
    >
      <div className="flex flex-col p-6 mt-30">
        <FilterButton label="All" onClick={() => onFilterChange("All")}/>
        <FilterButton label="Done" onClick={() => onFilterChange("Done")} />
        <FilterButton label="Upcoming" onClick={() => onFilterChange("Upcoming")} />

        <div className="mt-8" data-testid="pie-chart">
          <h3 className="text-center mb-4">Holiday Status Overview</h3>
          <Pie data={data} />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleGenerateRandomHolidays}
            className={`px-4 py-2 ${isGenerating ? 'bg-red-500' : 'bg-blue-500'} text-white rounded`}
            data-testid="generate-button"
          >
            {isGenerating ? 'Stop Generating Holidays' : 'Start Generating Holidays'}
          </button>
        </div>
      </div>
    </div>
  );
}

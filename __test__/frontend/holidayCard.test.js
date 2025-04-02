import '@testing-library/jest-dom'; 
import { render, screen, fireEvent } from "@testing-library/react";
import HolidayCard from "@/components/Holidays/HomePage/HolidayCard";

describe("HolidayCard Component", () => {
    const mockHoliday = {
        id: 1,
        name: "Beach Vacation",
        destination: "Hawaii",
        startDate: "2025-06-10",
        endDate: "2025-06-20",
        transport: "Plane",
        transport_price: 300,
        accommodation_price: 400
    };

    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnView = jest.fn();

    beforeEach(() => {
        render(
            <HolidayCard 
                holiday={mockHoliday} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
                onView={mockOnView} 
            />
        );
    });

    it("renders holiday details correctly", () => {
        expect(screen.getByText("Beach Vacation")).toBeInTheDocument();
        expect(screen.getByText("Hawaii")).toBeInTheDocument();
        expect(screen.getByText("2025-06-10")).toBeInTheDocument();
        expect(screen.getByText("2025-06-20")).toBeInTheDocument();
        expect(screen.getByText("Plane")).toBeInTheDocument();
        expect(screen.getByText(/💰💰 700 RON/)).toBeInTheDocument();
    });

    it("calls onEdit when edit button is clicked", () => {
        const editButton = screen.getByTestId("edit-button");
        fireEvent.click(editButton);
        expect(mockOnEdit).toHaveBeenCalledWith(mockHoliday);
    });

    it("calls onDelete when delete button is clicked", () => {
        const deleteButton = screen.getByTestId("delete-button");
        fireEvent.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalledWith(mockHoliday.id);
    });

    it("calls onView when view button is clicked", () => {
        const viewButton = screen.getByTestId("info-button");
        fireEvent.click(viewButton);
        expect(mockOnView).toHaveBeenCalledWith(mockHoliday);
    });
});

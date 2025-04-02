import { render, screen, fireEvent } from "@testing-library/react";
import HolidayGrid from "@/components/Holidays/HomePage/HolidayGrid";
import '@testing-library/jest-dom'; 


describe("HolidayGrid Component", () => {
    const mockHolidays = [
        {
            id: 1,
            name: "Beach Vacation",
            destination: "Hawaii",
            startDate: "2025-06-10",
            endDate: "2025-06-20",
            transport: "Plane",
            transport_price: 300,
            accommodation: "Hotel",
            accommodation_name: "Beach Resort",
            accommodation_price: 200,
            accommodation_location: "Hawaii",
        },
        {
            id: 2,
            name: "Mountain Adventure",
            destination: "Alps",
            startDate: "2025-07-15",
            endDate: "2025-07-25",
            transport: "Train",
            transport_price: 100,
            accommodation: "Hostel",
            accommodation_name: "Mountain Lodge",
            accommodation_price: 150,
            accommodation_location: "Alps",
        },
    ];

    const mockOnDelete = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnView = jest.fn();

    it("renders the holiday grid container", () => {
        render(
            <HolidayGrid
                holidays={mockHolidays}
                onDelete={mockOnDelete}
                onEdit={mockOnEdit}
                onView={mockOnView}
            />
        );

        // Check if the grid container is rendered
        expect(screen.getByTestId("holiday-grid")).toBeInTheDocument();
    });
});
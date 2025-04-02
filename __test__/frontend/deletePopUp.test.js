import { render, screen, fireEvent } from "@testing-library/react";
import DeletePopup from "@/components/Holidays/HomePage/DeletePopUp";
import '@testing-library/jest-dom'; 

describe("DeletePopup Component", () => {
    const mockOnClose = jest.fn();
    const mockOnDelete = jest.fn();
    const holidayName = "Beach Vacation";

    it("renders correctly when visible", () => {
        render(<DeletePopup isVisible={true} onClose={mockOnClose} onDelete={mockOnDelete} holidayName={holidayName} />);

        expect(screen.getByTestId("delete-popup")).toBeInTheDocument();
        expect(screen.getByTestId("delete-popup-title")).toHaveTextContent("Are you sure you want to delete this holiday?");
        expect(screen.getByTestId("delete-popup-holiday-name")).toHaveTextContent(holidayName);
    });

    it("does not render when not visible", () => {
        render(<DeletePopup isVisible={false} onClose={mockOnClose} onDelete={mockOnDelete} holidayName={holidayName} />);

        expect(screen.queryByTestId("delete-popup")).not.toBeInTheDocument();
    });

    it("calls onDelete and onClose when 'Yes' button is clicked", () => {
        render(<DeletePopup isVisible={true} onClose={mockOnClose} onDelete={mockOnDelete} holidayName={holidayName} />);

        fireEvent.click(screen.getByTestId("delete-popup-confirm"));

        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when 'No' button is clicked", () => {
        render(<DeletePopup isVisible={true} onClose={mockOnClose} onDelete={mockOnDelete} holidayName={holidayName} />);

        fireEvent.click(screen.getByTestId("delete-popup-cancel"));

        expect(mockOnClose).toHaveBeenCalledTimes(2);
    });
});

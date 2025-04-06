import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Import the DOM matchers
import CancelButton from "@/components/UI/Add&EditPage/CancelButton"; // Adjust the path if needed

describe("CancelButton Component", () => {
    test("renders the Cancel button", () => {
        render(<CancelButton onClick={() => {}} />);
        
        // Check if the button is in the document
        const button = screen.getByRole("button", { name: /cancel/i });
        expect(button).toBeInTheDocument();
    });

    test("calls onClick when clicked", () => {
        const onClickMock = jest.fn(); // Mock function
        render(<CancelButton onClick={onClickMock} />);

        const button = screen.getByRole("button", { name: /cancel/i });
        
        // Simulate click
        fireEvent.click(button);
        
        // Verify if the function was called
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });
});

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Import the DOM matchers
import DoneButton from "@/components/UI/AddPage/DoneButton"; // Adjust the path if needed

describe("DoneButton Component", () => {
    test("renders the Done button", () => {
        render(<DoneButton onClick={() => {}} />);
        
        // Check if the button is in the document
        const button = screen.getByRole("button", { name: /done/i });
        expect(button).toBeInTheDocument();
    });

    test("calls onClick when clicked", () => {
        const onClickMock = jest.fn(); // Mock function
        render(<DoneButton onClick={onClickMock} />);

        const button = screen.getByRole("button", { name: /done/i });
        
        // Simulate click
        fireEvent.click(button);
        
        // Verify if the function was called
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });
});

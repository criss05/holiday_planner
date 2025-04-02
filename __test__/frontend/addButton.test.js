import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddButton from "@/components/UI/HomePage/AddButton"; // Adjust the path if necessary

describe("AddButton Component", () => {
    test("renders button correctly", () => {
        render(<AddButton setIsAddPageVisible={jest.fn()} />);
        
        // Check if the button is rendered
        const button = screen.getByTestId("add-button");
        expect(button).toBeInTheDocument();
    });

    test("calls setIsAddPageVisible when clicked", () => {
        const setIsAddPageVisible = jest.fn();
        render(<AddButton setIsAddPageVisible={setIsAddPageVisible} />);
        
        const button = screen.getByTestId("add-button");

        // Click the button
        fireEvent.click(button);

        // Check if the callback function is called
        expect(setIsAddPageVisible).toHaveBeenCalledWith(true);
    });
});

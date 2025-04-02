import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputBox from "@/components/UI/AddPage/InputBox"; // Adjust path if necessary

describe("InputBox Component", () => {
    test("renders the input field", () => {
        render(<InputBox value="" onChange={() => {}} name="test-input" />);

        const input = screen.getByTestId("input-box");
        expect(input).toBeInTheDocument();
    });

    test("accepts user input", () => {
        const handleChange = jest.fn();
        render(<InputBox value="" onChange={handleChange} name="test-input" />);

        const input = screen.getByTestId("input-box");

        // Simulate user typing
        fireEvent.change(input, { target: { value: "Hello World" } });

        // Check if onChange was called
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith("Hello World");
    });

    test("displays the correct initial value", () => {
        render(<InputBox value="Initial Value" onChange={() => {}} name="test-input" />);

        const input = screen.getByTestId("input-box");
        expect(input).toHaveValue("Initial Value");
    });
});
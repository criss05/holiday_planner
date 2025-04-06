import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MiddleInputBox from "@/components/UI/Add&EditPage/MiddleInputBox"; // Adjust the path if necessary

describe("MiddleInputBox Component", () => {
    test("renders the input field with the correct label", () => {
        render(<MiddleInputBox text="Name" value="" onChange={() => {}} />);

        const label = screen.getByText("Name:");
        expect(label).toBeInTheDocument();

        const input = screen.getByTestId("middle-input-box");
        expect(input).toBeInTheDocument();
    });

    test("accepts user input", () => {
        const handleChange = jest.fn();
        render(<MiddleInputBox text="Destination" value="" onChange={handleChange} />);

        const input = screen.getByTestId("middle-input-box");

        // Simulate user typing
        fireEvent.change(input, { target: { value: "Hawaii" } });

        // Check if onChange was called
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test("displays the correct initial value", () => {
        render(<MiddleInputBox text="City" value="Paris" onChange={() => {}} />);

        const input = screen.getByTestId("middle-input-box");
        expect(input).toHaveValue("Paris");
    });
});

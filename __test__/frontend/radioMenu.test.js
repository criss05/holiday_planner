import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RadioMenu from "@/components/UI/AddPage/RadioMenu"; // Adjust the path if necessary

describe("RadioMenu Component", () => {
    test("renders all radio options correctly", () => {
        const options = ["Option 1", "Option 2", "Option 3"];
        render(<RadioMenu options={options} value="" onChange={() => {}} name="test-radio" />);

        // Check if all radio buttons are rendered
        options.forEach((option) => {
            const radioButton = screen.getByTestId(`radio-${option.toLowerCase()}`);
            expect(radioButton).toBeInTheDocument();
        });
    });

    test("sets the correct radio button as checked", () => {
        const options = ["Option 1", "Option 2", "Option 3"];
        render(<RadioMenu options={options} value="Option 2" onChange={() => {}} name="test-radio" />);

        const checkedRadioButton = screen.getByTestId("radio-option 2");
        expect(checkedRadioButton).toBeChecked();
    });

    test("calls onChange when a radio button is selected", () => {
        const handleChange = jest.fn();
        const options = ["Option 1", "Option 2", "Option 3"];
        render(<RadioMenu options={options} value="Option 1" onChange={handleChange} name="test-radio" />);

        // Simulate a change event by selecting another radio button
        fireEvent.click(screen.getByTestId("radio-option 2"));

        expect(handleChange).toHaveBeenCalledWith("Option 2");
        expect(handleChange).toHaveBeenCalledTimes(1);
    });
});

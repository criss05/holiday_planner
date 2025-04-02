import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RadioMenu from "@/components/UI/DetailsPage/RadioMenu"; // Adjust the path if necessary

describe("RadioMenu Component", () => {
    const options = ["Option 1", "Option 2", "Option 3"];

    test("renders radio buttons correctly", () => {
        render(<RadioMenu options={options} value="Option 1" name="test" disabled/>);
        
        // Check that each radio button is rendered with the updated test ID
        options.forEach(option => {
            const radioButton = screen.getByTestId(`radio-input-details-${option.toLowerCase()}`);
            expect(radioButton).toBeInTheDocument();
        });
    });

    test("checks the selected radio button", () => {
        render(<RadioMenu options={options} value="Option 1" name="test" disabled/>);
        
        const selectedRadio = screen.getByTestId("radio-input-details-option 1");
        expect(selectedRadio).toBeChecked();
    });

    test("does not allow change when disabled", () => {
        render(<RadioMenu options={options} value="Option 1" name="test" disabled/>);
        
        const radioButton = screen.getByTestId("radio-input-details-option 1");
        expect(radioButton).toBeDisabled();

        fireEvent.click(radioButton);
        expect(radioButton).toBeChecked(); // The value shouldn't change when disabled
    });
});

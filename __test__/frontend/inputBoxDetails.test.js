import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputBox from "@/components/UI/DetailsPage/InputBox"; // Adjust the path if necessary

describe("InputBox Component", () => {
    test("renders InputBox correctly", () => {
        render(<InputBox value="Test Value" disabled name="test-input" />);
        
        const inputBox = screen.getByTestId("input-box-details");
        expect(inputBox).toBeInTheDocument();
        expect(inputBox).toHaveValue("Test Value");
    });

    test("does not allow typing because disabled", () => {
        render(<InputBox value="Test Value" disabled name="test-input" />);
        
        const inputBox = screen.getByTestId("input-box-details");
        expect(inputBox).toBeDisabled();
        fireEvent.change(inputBox, { target: { value: "New Value" } });
        expect(inputBox).toHaveValue("Test Value"); // The value shouldn't change when disabled
    });
});

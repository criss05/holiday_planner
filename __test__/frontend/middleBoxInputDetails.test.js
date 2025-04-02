import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MiddleInputBox from "@/components/UI/DetailsPage/MiddleInputBox";// Adjust the path if necessary

describe("MiddleInputBox Component", () => {
    test("renders MiddleInputBox correctly", () => {
        render(<MiddleInputBox text="Test" value="Initial Value" disabled />);
        
        const inputBox = screen.getByTestId("middle-input-box-details");
        expect(inputBox).toBeInTheDocument();
        expect(inputBox).toHaveValue("Initial Value");
    });

    test("does not allow typing because disabled", () => {
        render(<MiddleInputBox text="Test" value="Initial Value" disabled />);
        
        const inputBox = screen.getByTestId("middle-input-box-details");
        expect(inputBox).toBeDisabled();
        fireEvent.change(inputBox, { target: { value: "New Value" } });
        expect(inputBox).toHaveValue("Initial Value"); // The value shouldn't change when disabled
    });
});

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BackButton from "@/components/UI/DetailsPage/BackButton"; // Adjust the path if necessary

describe("BackButton Component", () => {
    test("renders Back button correctly", () => {
        render(<BackButton onClick={() => {}} />);
        
        const button = screen.getByTestId("back-button");
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent("Back");
    });

    test("calls onClick when the button is clicked", () => {
        const handleClick = jest.fn();
        render(<BackButton onClick={handleClick} />);
        
        const button = screen.getByTestId("back-button");
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});

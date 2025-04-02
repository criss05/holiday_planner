import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterButton from "@/components/UI/HomePage/FilterButton"; // Adjust the path if necessary

describe("FilterButton Component", () => {
    test("renders button correctly", () => {
        render(<FilterButton label="Filter" onClick={jest.fn()} />);
        
        // Check if the button is rendered
        const button = screen.getByTestId("filter-button");
        expect(button).toBeInTheDocument();
    });

    test("calls onClick when clicked", () => {
        const handleClick = jest.fn();
        render(<FilterButton label="Filter" onClick={handleClick} />);
        
        const button = screen.getByTestId("filter-button");

        // Click the button
        fireEvent.click(button);

        // Check if the callback function is called
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});

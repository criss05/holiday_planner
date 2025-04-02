import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "@/components/UI/HomePage/Pagination"; // Ensure the correct path to the Pagination component
import '@testing-library/jest-dom'; 

describe('Pagination Component', () => {
    const mockSetCurrentPage = jest.fn();

    test('renders Pagination component correctly', () => {
        render(
            <Pagination
                currentPage={1}
                totalPages={5}
                setCurrentPage={mockSetCurrentPage}
            />
        );

        // Check if the Previous button is rendered
        const previousButton = screen.getByText(/Previous/i);
        expect(previousButton).toBeInTheDocument();

        // Check if the Next button is rendered
        const nextButton = screen.getByText(/Next/i);
        expect(nextButton).toBeInTheDocument();

        // Check if the page counter is displayed correctly
        const pageCounter = screen.getByText(/Page 1\/5/i);
        expect(pageCounter).toBeInTheDocument();
    });

    test('Previous button is disabled when on the first page', () => {
        render(
            <Pagination
                currentPage={1}
                totalPages={5}
                setCurrentPage={mockSetCurrentPage}
            />
        );

        // Get the Previous button and check if it is disabled
        const previousButton = screen.getByText(/Previous/i);
        expect(previousButton).toBeDisabled();
    });

    test('Next button is enabled when not on the last page', () => {
        render(
            <Pagination
                currentPage={1}
                totalPages={5}
                setCurrentPage={mockSetCurrentPage}
            />
        );

        // Get the Next button and check if it is enabled
        const nextButton = screen.getByText(/Next/i);
        expect(nextButton).toBeEnabled();
    });

    test('Previous button is enabled when not on the first page', () => {
        render(
            <Pagination
                currentPage={2}
                totalPages={5}
                setCurrentPage={mockSetCurrentPage}
            />
        );

        // Get the Previous button and check if it is enabled
        const previousButton = screen.getByText(/Previous/i);
        expect(previousButton).toBeEnabled();
    });

    test('Next button is disabled when on the last page', () => {
        render(
            <Pagination
                currentPage={5}
                totalPages={5}
                setCurrentPage={mockSetCurrentPage}
            />
        );

        // Get the Next button and check if it is disabled
        const nextButton = screen.getByText(/Next/i);
        expect(nextButton).toBeDisabled();
    });

    test('calls setCurrentPage when Previous button is clicked', () => {
        render(
            <Pagination
                currentPage={2}
                totalPages={5}
                setCurrentPage={mockSetCurrentPage}
            />
        );

        const previousButton = screen.getByText(/Previous/i);

        // Simulate the click on the Previous button
        fireEvent.click(previousButton);

        // Check if setCurrentPage is called with correct argument (1)
        expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
    });

    test('calls setCurrentPage when Next button is clicked', () => {
        render(
            <Pagination
                currentPage={1}
                totalPages={5}
                setCurrentPage={mockSetCurrentPage}
            />
        );

        const nextButton = screen.getByText(/Next/i);

        // Simulate the click on the Next button
        fireEvent.click(nextButton);

        // Check if setCurrentPage is called with correct argument (2)
        expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
    });
});

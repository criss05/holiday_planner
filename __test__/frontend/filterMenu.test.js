import { render, screen, fireEvent } from "@testing-library/react"; // Importing the DOM utilities
import FilterMenu from "@/components/UI/HomePage/FilterMenu";
import '@testing-library/jest-dom';
import { Pie } from "react-chartjs-2";


jest.mock('react-chartjs-2', () => ({
    Pie: jest.fn(() => <div data-testid="mock-pie-chart" />),
}));



describe('FilterMenu', () => {
    const mockOnFilterChange = jest.fn();
    const mockSetHolidays = jest.fn();
    const holidays = [
        { name: 'Holiday 1', endDate: '2025-04-01' },
        { name: 'Holiday 2', endDate: '2025-04-10' },
    ];

    test('renders FilterMenu when visible', () => {
        render(
            <FilterMenu
                isVisible={true}
                onFilterChange={mockOnFilterChange}
                holidays={holidays}
                setHolidays={mockSetHolidays}
            />
        );

        // Check if the FilterMenu is rendered
        const filterMenu = screen.getByTestId('filter-menu');
        expect(filterMenu).toBeInTheDocument();

        // Check if the mock Pie chart is rendered
        const pieChart = screen.getByTestId('mock-pie-chart');
        expect(pieChart).toBeInTheDocument();
    });

    test('clicking generate button starts and stops generating holidays', () => {
        render(
            <FilterMenu
                isVisible={true}
                onFilterChange={mockOnFilterChange}
                holidays={holidays}
                setHolidays={mockSetHolidays}
            />
        );

        // Check initial button text
        const generateButton = screen.getByText('Start Generating Holidays');
        expect(generateButton).toBeInTheDocument();

        // Simulate button click to start generating holidays
        fireEvent.click(generateButton);

        // Check if the button text changes to stop generating
        expect(generateButton).toHaveTextContent('Stop Generating Holidays');

        // Simulate another button click to stop generating holidays
        fireEvent.click(generateButton);

        // Check if the button text changes back
        expect(generateButton).toHaveTextContent('Start Generating Holidays');
    });
});
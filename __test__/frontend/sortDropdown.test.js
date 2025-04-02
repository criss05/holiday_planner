import { render, screen, fireEvent } from "@testing-library/react";
import SortDropdown from "@/components/UI/HomePage/SortDropdown";
import '@testing-library/jest-dom'; 

describe('SortDropdown Component', () => {
    const mockSetSortBy = jest.fn();

    test('renders SortDropdown with correct options', () => {
        render(<SortDropdown sortBy="Start Date" setSortBy={mockSetSortBy} />);
        
        // Check if the label is rendered correctly
        const label = screen.getByText(/Sort by:/i);
        expect(label).toBeInTheDocument();

        // Check if the dropdown is rendered correctly
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();

        // Check if all options are available in the dropdown
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(5);  // We have 5 options in total
        expect(options[0]).toHaveTextContent('Start Date');
        expect(options[1]).toHaveTextContent('End Date');
        expect(options[2]).toHaveTextContent('Destination');
        expect(options[3]).toHaveTextContent('Name');
        expect(options[4]).toHaveTextContent('Transport');
    });

    test('displays the correct selected value', () => {
        render(<SortDropdown sortBy="Start Date" setSortBy={mockSetSortBy} />);

        // Check if the selected value is displayed correctly
        const select = screen.getByRole('combobox');
        expect(select).toHaveValue('Start Date');
    });

    test('calls setSortBy with correct value when an option is selected', () => {
        render(<SortDropdown sortBy="Start Date" setSortBy={mockSetSortBy} />);
        
        // Get the select dropdown and change its value to "End Date"
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'End Date' } });

        // Check if setSortBy was called with the correct value
        expect(mockSetSortBy).toHaveBeenCalledWith('End Date');
    });

    test('calls setSortBy with correct value when another option is selected', () => {
        render(<SortDropdown sortBy="Start Date" setSortBy={mockSetSortBy} />);
        
        // Get the select dropdown and change its value to "Destination"
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'Destination' } });

        // Check if setSortBy was called with the correct value
        expect(mockSetSortBy).toHaveBeenCalledWith('Destination');
    });
});

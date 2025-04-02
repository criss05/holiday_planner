import { render, screen, fireEvent } from "@testing-library/react"; 
import Header from "@/components/UI/HomePage/HeaderHome"; // Ensure the correct path to the Header component
import '@testing-library/jest-dom'; 



describe("Header Component", () => {
    it("renders the header correctly", () => {
        render(<Header />);

        expect(screen.getByTestId("header-home")).toBeInTheDocument();
        expect(screen.getByTestId("header-home-title")).toHaveTextContent("Holiday Planner");
        expect(screen.getByTestId("user-home-icon")).toBeInTheDocument();
        expect(screen.getByTestId("bars-icon")).toBeInTheDocument();
    });
});

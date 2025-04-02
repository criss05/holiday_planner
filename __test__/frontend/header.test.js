import { render, screen } from "@testing-library/react";
import HeaderAdd from "@/components/UI/Header"; // Adjust import path if needed
import '@testing-library/jest-dom'; 

describe("HeaderAdd Component", () => {
    it("renders the header correctly", () => {
        render(<HeaderAdd />);

        expect(screen.getByTestId("header")).toBeInTheDocument();
        expect(screen.getByTestId("header-title")).toHaveTextContent("Holiday Planner");
        expect(screen.getByTestId("header-user-icon")).toBeInTheDocument();
    });
});

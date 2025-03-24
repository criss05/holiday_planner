import { FaUser } from "react-icons/fa";

export default function HeaderAdd() {
    return (
        <header className="bg-[#8CD3EF] p-3 flex justify-between items-center">
            <div></div>
            <h1 className="text-3xl font-roboto font-bold">Holiday Planner</h1>
            <FaUser className="text-2xl" />
        </header>
    );
}
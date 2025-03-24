import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import AddPage from "../../../pages/AddPage";


export default function AddButton() {
    return (
        <Link href="/AddPage">
            <button className="fixed bottom-6 right-6 bg-[#73DAFF] border-2 p-4 rounded-full shadow-lg">
                <FaPlus className="text-2xl" />
            </button>
        </Link>
    );
}
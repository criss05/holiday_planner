import { FaPlus } from 'react-icons/fa';


export default function AddButton({ setIsAddPageVisible }) {
    return (
            <button className="fixed bottom-6 right-6 bg-[#73DAFF] border-2 p-4 rounded-full shadow-lg"
            onClick={() => setIsAddPageVisible(true)}>
                <FaPlus className="text-2xl" />
            </button>
    );
}
import Link from 'next/link';

export default function DoneButton({onClick}) {
    return (
            <button className="bg-[#73DAFF] rounded-2xl shadow-lg h-10 w-23"
            onClick={onClick}
            aria-label="done">
                Done
            </button>
    );
}
import Link from 'next/link';

export default function DoneButton() {
    return (
        <Link href="/">
            <button className="bg-[#73DAFF] rounded-2xl shadow-lg h-10 w-23">
                Done
            </button>
        </Link>
    );
}
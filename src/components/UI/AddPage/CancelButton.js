import Link from 'next/link';

export default function CancelButton() {
    return (
        <Link href="/">
            <button className="bg-[#73DAFF] rounded-2xl shadow-lg h-10 w-23">
                Cancel
            </button>
        </Link>
    );
}
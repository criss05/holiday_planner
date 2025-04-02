export default function BackButton({ onClick }) {
    return (
        <button className="bg-[#73DAFF] rounded-2xl shadow-lg h-10 w-23"
            onClick={onClick}
            data-testid="back-button">
            Back
        </button>
    );
}
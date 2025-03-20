export default function FilterButton({ label, onClick }) {
    return (
      <button
        onClick={onClick}
        className="bg-[#68ccf4] px-4 py-2 rounded-md w-full mb-4 text-center"
      >
        <strong>{label}</strong>
      </button>
    );
  }
  
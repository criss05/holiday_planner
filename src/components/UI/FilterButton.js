export default function FilterButton({ label, onClick }) {
    return (
      <button
        onClick={onClick}
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mb-4 text-center"
      >
        {label}
      </button>
    );
  }
  
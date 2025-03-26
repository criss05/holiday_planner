export default function InputBox({value, onChange, name }) {
    return (
        <input
            type="text"
            className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-500"
            value = {value}
            onChange={(e) => onChange(e.target.value)}
            name={name}
        />
    );
}
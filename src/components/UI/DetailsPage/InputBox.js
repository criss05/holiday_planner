export default function InputBox({value, disabled, name }) {
    return (
        <input
            type="text"
            className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-500"
            value = {value}
            disabled={disabled}
            name={name}
            data-testid="input-box-details"
        />
    );
}
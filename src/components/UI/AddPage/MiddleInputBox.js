export default function MiddleInputBox({text, value, onChange}){
    return (
        <div className="flex flex-col">
            <label htmlFor={text.toLowerCase()} className="text-gray-700 font-semibold mb-2">
                {text}:
            </label>
            <input
                id={text.toLowerCase()}
                type="text"
                placeholder={`Enter ${text.toLowerCase()}`}
                className="p-2 border-2 border-[#A7CFFF] rounded-md"
                value={value}
                onChange={onChange}
                data-testid="middle-input-box"
            />
        </div>
      );
}
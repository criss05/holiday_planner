export default function MiddleInputBox({text}){
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
            />
        </div>
      );
}
import InputBox from "./InputBox";

export default function InformationFields({ text, icon }) {
    return (
        <div className="grid grid-cols-2 gap-6 p-3">
            <label className="text-gray-800 font-semibold text-3xl">{text}:</label>
            <div className="flex items-center bg-blue-100 border border-blue-300 px-3 py-2">
                {icon && <span className="mr-2 text-2xl">{icon}</span>}
                <InputBox text={text}/>
            </div>
        </div>
    );
}
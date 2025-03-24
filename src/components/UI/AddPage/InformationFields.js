import Calendar from "./Calendar";
import InputBox from "./InputBox";
import TransportOptions from "./TransportOptions";
import TransportPrice from "./TransportPriceBox";

export default function InformationFields({ text, icon }) {
    return (
        <div className="grid grid-cols-2 gap-6 pb-10">
            <label className="text-gray-800 font-semibold text-3xl pr-10">{text}:</label>
            <div className="flex items-center bg-blue-100 border border-blue-300 px-3 py-2">
                {icon && <span className="mr-2 text-2xl">{icon}</span>}
                {text.toLowerCase().includes("name") || text.toLowerCase().includes("where") ? (
                    <InputBox />
                ) : text.toLowerCase().includes("transport") ? (
                    <div className="grid grid-cols-2">
                        <div className="pl-3">
                            <TransportOptions />
                        </div>
                        <div className="flex align-center items-center">
                            <TransportPrice />
                        </div>
                    </div>
                ) : text.toLowerCase().includes("when") ? (
                    <Calendar />
                ) : (
                    <InputBox />
                )
                }
            </div>
        </div>
    );
}
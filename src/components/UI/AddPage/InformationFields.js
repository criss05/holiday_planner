import Calendar from "./Calendar";
import InputBox from "./InputBox";
import MiddleInputBox from "./MiddleInputBox";
import RadioMenu from "./RadioMenu";


export default function InformationFields({ text, icon }) {
    const transport = ["Car", "Plane", "Train", "Bus", "Ship"]
    const accommodation = ["Hotel", "Motel", "Hostel", "Apartment", "Cabin", "Resort", "Villa", "Campsite"]

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
                            <RadioMenu options={transport} />
                        </div>
                        <div>
                            <MiddleInputBox text="Price" />
                        </div>
                    </div>
                ) : text.toLowerCase().includes("when") ? (
                    <div className="flex justify-items-center w-full">
                        <Calendar startDate={new Date()} endDate={new Date()}/>
                    </div>
                ) : text.toLowerCase().includes("accommodation") ? (
                    <div className="grid grid-cols-2">
                        <div className="pl-3">
                            <RadioMenu options={accommodation} />
                        </div>
                        <div>
                            <MiddleInputBox text="Price" />
                            <MiddleInputBox text="Name" />
                            <MiddleInputBox text="Location" />
                        </div>
                    </div>
                ) : (
                    <div></div>
                )
                }
                
            </div>
        </div>
    );
}
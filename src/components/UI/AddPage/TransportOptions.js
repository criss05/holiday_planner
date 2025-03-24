import {
    useState


} from "react";
export default function TransportOptions() {
    const [selectedOption, setSelectedOption] = useState("");

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    }

    return (
        <form>
            <div>
                <input
                    type="radio"
                    id="car"
                    name="Car"
                    value="Car"
                    checked={selectedOption === "Car"}
                    onChange={handleOptionChange}
                />
                <strong><label className="px-2 text-xl" htmlFor="car">Car</label></strong>
            </div>
            <div>
                <input
                    type="radio"
                    id="plane"
                    name="Plane"
                    value="Plane"
                    checked={selectedOption === "Plane"}
                    onChange={handleOptionChange}
                />
                <strong><label className="px-2 text-xl" htmlFor="plane">Plane</label></strong>
            </div>
            <div>
                <input
                    type="radio"
                    id="train"
                    name="Train"
                    value="Train"
                    checked={selectedOption === "Train"}
                    onChange={handleOptionChange}
                />
                <strong><label className="px-2 text-xl" htmlFor="train">Train</label></strong>
            </div>
            <div>
                <input
                    type="radio"
                    id="bus"
                    name="Bus"
                    value="Bus"
                    checked={selectedOption === "Bus"}
                    onChange={handleOptionChange}
                />
                <strong><label className="px-2 text-xl" htmlFor="bus">Bus</label></strong>
            </div>
            <div>
                <input
                    type="radio"
                    id="ship"
                    name="Ship"
                    value="Ship"
                    checked={selectedOption === "Ship"}
                    onChange={handleOptionChange}
                />
                <strong><label className="px-2 text-xl" htmlFor="ship">Ship</label></strong>
            </div>
        </form>
    )
}
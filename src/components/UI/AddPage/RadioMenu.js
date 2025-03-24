import { useState } from "react";



export default function RadioMenu({ options }) {
    const [selectedOption, setSelectedOption] = useState("");

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    }

    return (
        <form>
            {options.map((option) => (
                <div>
                    <input
                        type="radio"
                        id={option.toLowerCase()}
                        name={option}
                        value={option}
                        checked={selectedOption === option}
                        onChange={handleOptionChange}
                    />
                    <strong>
                        <label className="px-2 text-xl" htmlFor={option.toLowerCase()}>
                            {option}
                        </label>
                    </strong>
                </div>
            ))}
        </form>
    )
}
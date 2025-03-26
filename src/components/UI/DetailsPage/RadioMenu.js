import { useState } from "react";



export default function RadioMenu({ options, value, disabled, name }) {
    return (
        <form>
            {options.map((option) => (
                <div key="option">
                    <input
                        type="radio"
                        id={option.toLowerCase()}
                        name={name}
                        value={option}
                        checked={value === option}
                        disabled={disabled}
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
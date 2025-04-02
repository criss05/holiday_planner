import { useState } from "react";



export default function RadioMenu({ options, value, onChange, name }) {
    return (
        <form>
            {options.map((option) => (
                <div key={option}>
                    <input
                        type="radio"
                        id={option.toLowerCase()}
                        name={name}
                        value={option}
                        checked={value === option}
                        onChange={(e) => onChange(e.target.value)}
                        data-testid={`radio-${option.toLowerCase()}`}
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
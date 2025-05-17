export default function RadioMenu({ options, value, disabled, name }) {
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
                        disabled={disabled}
                        data-testid={`radio-input-details-${option.toLowerCase()}`}
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
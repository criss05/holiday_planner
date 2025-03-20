


export default function SortDropdown({ sortBy, setSortBy }) {

    return (
        <div className="p-4 flex justify-end">
            <label className="mr-2">Sort by:</label>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border rounded-lg bg-blue-100">
                <option>Start Date</option>
                <option>End Date</option>
                <option>Destination</option>
                <option>Name</option>
                <option>Transport</option>
            </select>
        </div>
    );
}
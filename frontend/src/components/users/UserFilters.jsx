export default function UserFilters({ filters, onChange }) {
  return (
    <div className="p-4 border rounded bg-gray-50">
      <h2 className="font-semibold mb-2">Filters</h2>
      {["firstName", "lastName", "email", "department"].map(f => (
        <input
          key={f}
          placeholder={`Filter by ${f}`}
          value={filters[f] || ""}
          onChange={e => onChange(f, e.target.value)}
          className="border p-2 w-full mb-2"
        />
      ))}
    </div>
  )
}

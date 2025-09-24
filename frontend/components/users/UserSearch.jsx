export default function UserSearch({ query, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search name, email, department..."
      value={query}
      onChange={e => onChange(e.target.value)}
      className="border p-2 rounded w-full"
    />
  )
}

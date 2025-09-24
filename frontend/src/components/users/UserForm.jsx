export default function UserForm({ initialData, onSubmit, onCancel }) {
  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const user = Object.fromEntries(formData.entries())
        onSubmit(user)
      }}
    >
      <input name="firstName" defaultValue={initialData?.firstName} placeholder="First Name" className="border p-2 w-full" required />
      <input name="lastName" defaultValue={initialData?.lastName} placeholder="Last Name" className="border p-2 w-full" required />
      <input type="email" name="email" defaultValue={initialData?.email} placeholder="Email" className="border p-2 w-full" required />
      <input name="department" defaultValue={initialData?.department} placeholder="Department" className="border p-2 w-full" required />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  )
}

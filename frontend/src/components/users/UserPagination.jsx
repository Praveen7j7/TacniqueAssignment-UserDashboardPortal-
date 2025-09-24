export default function UserPagination({ page, totalPages, perPage, onPageChange, onPerPageChange }) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div>
        <label>Per Page: </label>
        <select value={perPage} onChange={e => onPerPageChange(Number(e.target.value))} className="border p-1">
          {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div className="space-x-2">
        <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
      </div>
    </div>
  )
}

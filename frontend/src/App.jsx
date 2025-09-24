import React, { useEffect, useState, useMemo, useRef } from "react";


// Requirements :
// - Fetch users from JSONPlaceholder /users
// - View, Add, Edit, Delete (using simulated responses)
// - Pagination (10,25,50,100) + Infinite-scroll toggle
// - Filter popup (firstName, lastName, email, department)
// - Search, Sort, Responsive table, Client-side validation, Error handling
// - Tailwind CSS classes used for styling (assumes Tailwind is installed in project)

export default function UserManagementApp() {
  const API_BASE = "https://jsonplaceholder.typicode.com";
  const [users, setUsers] = useState([]); // raw from API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [infinite, setInfinite] = useState(false);

  const [searchQ, setSearchQ] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  // filter state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ firstName: "", lastName: "", email: "", department: "" });

  // modal / form
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null => create
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", department: "" });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const containerRef = useRef(null);

  // fetch users
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/users`)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch users (${r.status})`);
        return r.json();
      })
      .then((data) => {
        // JSONPlaceholder returns users with name; split into first/last for demo
        const mapped = data.map((u) => {
          const nameParts = (u.name || "").split(" ");
          return {
            id: u.id,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: u.email || "",
            department: u.company?.name || "General",
          };
        });
        setUsers(mapped);
      })
      .catch((e) => setError(e.message || "Unknown error"))
      .finally(() => setLoading(false));
  }, []);

  // Derived: filtered, searched, sorted
  const processedUsers = useMemo(() => {
    let list = [...users];
    // Filters
    if (filters.firstName) list = list.filter((u) => u.firstName.toLowerCase().includes(filters.firstName.toLowerCase()));
    if (filters.lastName) list = list.filter((u) => u.lastName.toLowerCase().includes(filters.lastName.toLowerCase()));
    if (filters.email) list = list.filter((u) => u.email.toLowerCase().includes(filters.email.toLowerCase()));
    if (filters.department) list = list.filter((u) => u.department.toLowerCase().includes(filters.department.toLowerCase()));

    // Search across fields
    if (searchQ) {
      const q = searchQ.toLowerCase();
      list = list.filter((u) => `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q));
    }

    // Sort
  //   list.sort((a, b) => {
  //     const A = (a[sortField] || "").toString().toLowerCase();
  //     const B = (b[sortField] || "").toString().toLowerCase();
  //     if (A < B) return sortDir === "asc" ? -1 : 1;
  //     if (A > B) return sortDir === "asc" ? 1 : -1;
  //     return 0;
  //   });

  //   return list;
  // }, [users, filters, searchQ, sortField, sortDir]);
  // Sort
  list.sort((a, b) => {
    let A = a[sortField];
    let B = b[sortField];

    // Numeric sort for IDs
    if (sortField === "id") {
      A = Number(A);
      B = Number(B);
    } else {
      A = (A || "").toString().toLowerCase();
      B = (B || "").toString().toLowerCase();
    }

    if (A < B) return sortDir === "asc" ? -1 : 1;
    if (A > B) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return list;
}, [users, filters, searchQ, sortField, sortDir]);

  // Pagination slice
  const total = processedUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const pagedUsers = useMemo(() => {
    if (infinite) return processedUsers.slice(0, page * pageSize);
    const start = (page - 1) * pageSize;
    return processedUsers.slice(start, start + pageSize);
  }, [processedUsers, page, pageSize, infinite]);

  // infinite scroll handler (if enabled)
  useEffect(() => {
    if (!infinite) return;
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.bottom - window.innerHeight < 300) {
        setPage((p) => Math.min(totalPages, p + 1));
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [infinite, totalPages]);

  // Form helpers
  const openCreate = () => {
    setEditingUser(null);
    setFormData({ firstName: "", lastName: "", email: "", department: "" });
    setFormErrors({});
    setFormOpen(true);
  };
  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email, department: user.department });
    setFormErrors({});
    setFormOpen(true);
  };

  function validate(data) {
    const e = {};
    if (!data.firstName || data.firstName.trim().length < 2) e.firstName = "First name must be at least 2 characters";
    if (!data.lastName || data.lastName.trim().length < 1) e.lastName = "Last name required";
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Valid email required";
    if (!data.department || data.department.trim().length < 2) e.department = "Department required";
    return e;
  }

  const submitForm = async (ev) => {
    ev && ev.preventDefault();
    const errs = validate(formData);
    setFormErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    setError(null);

    try {
      if (editingUser) {
        // PUT simulated
        const res = await fetch(`${API_BASE}/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editingUser, name: `${formData.firstName} ${formData.lastName}`, email: formData.email, company: { name: formData.department } }),
        });
        if (!res.ok) throw new Error(`Failed to update user (${res.status})`);
        const updated = await res.json();
        // Update local state (JSONPlaceholder doesn't persist)
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)));
      } else {
        // POST simulated
        const res = await fetch(`${API_BASE}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: `${formData.firstName} ${formData.lastName}`, email: formData.email, company: { name: formData.department } }),
        });
        if (!res.ok) throw new Error(`Failed to create user (${res.status})`);
        const created = await res.json();
        // JSONPlaceholder returns an id; append to local state
        const newUser = { id: created.id || Date.now(), ...formData };
        setUsers((prev) => [newUser, ...prev]);
      }
      setFormOpen(false);
    } catch (e) {
      setError(e.message || "Unknown error while submitting");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUser = async (u) => {
    if (!window.confirm(`Delete user ${u.firstName} ${u.lastName}?`)) return;
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/users/${u.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete (${res.status})`);
      // Remove locally
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (e) {
      setError(e.message || "Unknown error while deleting");
    }
  };

  // small helper to toggle sorting
  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" ref={containerRef}>
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">User Management</h1>
          <div className="flex items-center gap-2">
            <input
              aria-label="Search users"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search name, email, department..."
              className="px-3 py-2 border rounded-md bg-white"
            />
            <button onClick={() => setFiltersOpen((s) => !s)} className="px-3 py-2 border rounded-md bg-white">
              Filters
            </button>
            <button onClick={openCreate} className="px-3 py-2 bg-blue-600 text-white rounded-md">
              Add User
            </button>
          </div>
        </header>

        {filtersOpen && (
          <div className="p-4 bg-white rounded-md shadow mb-4">
            <h3 className="font-medium mb-2">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input placeholder="First name" value={filters.firstName} onChange={(e) => setFilters((f) => ({ ...f, firstName: e.target.value }))} className="px-3 py-2 border rounded-md" />
              <input placeholder="Last name" value={filters.lastName} onChange={(e) => setFilters((f) => ({ ...f, lastName: e.target.value }))} className="px-3 py-2 border rounded-md" />
              <input placeholder="Email" value={filters.email} onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))} className="px-3 py-2 border rounded-md" />
              <input placeholder="Department" value={filters.department} onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))} className="px-3 py-2 border rounded-md" />
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => { setFilters({ firstName: "", lastName: "", email: "", department: "" }); }} className="px-3 py-2 border rounded-md">Reset</button>
              <button onClick={() => setFiltersOpen(false)} className="px-3 py-2 bg-gray-800 text-white rounded-md">Close</button>
            </div>
          </div>
        )}

        <main className="bg-white rounded-md shadow overflow-hidden">
          <div className="p-3 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm text-gray-600">Showing <strong>{pagedUsers.length}</strong> of <strong>{total}</strong> users</div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Per page:</label>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="px-2 py-1 border rounded">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <label className="flex items-center gap-1 text-sm">
                <input type="checkbox" checked={infinite} onChange={(e) => { setInfinite(e.target.checked); setPage(1); }} /> Infinite
              </label>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort("id")}>ID {sortField === "id" ? (sortDir === "asc" ? "▲" : "▼") : ""}</th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort("firstName")}>First Name {sortField === "firstName" ? (sortDir === "asc" ? "▲" : "▼") : ""}</th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort("lastName")}>Last Name {sortField === "lastName" ? (sortDir === "asc" ? "▲" : "▼") : ""}</th>
                  <th className="px-3 py-2 cursor-pointer hidden md:table-cell" onClick={() => toggleSort("email")}>Email {sortField === "email" ? (sortDir === "asc" ? "▲" : "▼") : ""}</th>
                  <th className="px-3 py-2 cursor-pointer hidden lg:table-cell" onClick={() => toggleSort("department")}>Department {sortField === "department" ? (sortDir === "asc" ? "▲" : "▼") : ""}</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="p-6 text-center">Loading...</td></tr>
                )}
                {!loading && pagedUsers.length === 0 && (
                  <tr><td colSpan={6} className="p-6 text-center">No users found.</td></tr>
                )}

                {pagedUsers.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 align-top">{u.id}</td>
                    <td className="px-3 py-2 align-top">{u.firstName}</td>
                    <td className="px-3 py-2 align-top">{u.lastName}</td>
                    <td className="px-3 py-2 align-top hidden md:table-cell">{u.email}</td>
                    <td className="px-3 py-2 align-top hidden lg:table-cell">{u.department}</td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(u)} className="px-2 py-1 border rounded">Edit</button>
                        <button onClick={() => deleteUser(u)} className="px-2 py-1 border rounded text-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {!infinite && (
            <div className="p-3 flex items-center justify-between gap-2">
              <div className="text-sm">Page {page} / {totalPages}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50">First</button>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Last</button>
              </div>
            </div>
          )}
        </main>

        {/* Error banner */}
        {error && <div className="mt-3 p-3 bg-red-100 text-red-800 rounded">{error}</div>}

        {/* Form modal (create/edit) */}
        {formOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <form onSubmit={submitForm} className="bg-white rounded-lg w-full max-w-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-medium">{editingUser ? `Edit ${editingUser.firstName}` : "Add User"}</h2>
                <button type="button" onClick={() => setFormOpen(false)} className="px-2 py-1">Close</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm">First name</label>
                  <input value={formData.firstName} onChange={(e) => setFormData((d) => ({ ...d, firstName: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                  {formErrors.firstName && <div className="text-sm text-red-600">{formErrors.firstName}</div>}
                </div>
                <div>
                  <label className="block text-sm">Last name</label>
                  <input value={formData.lastName} onChange={(e) => setFormData((d) => ({ ...d, lastName: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                  {formErrors.lastName && <div className="text-sm text-red-600">{formErrors.lastName}</div>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm">Email</label>
                  <input value={formData.email} onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                  {formErrors.email && <div className="text-sm text-red-600">{formErrors.email}</div>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm">Department</label>
                  <input value={formData.department} onChange={(e) => setFormData((d) => ({ ...d, department: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                  {formErrors.department && <div className="text-sm text-red-600">{formErrors.department}</div>}
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setFormOpen(false)} className="px-3 py-2 border rounded">Cancel</button>
                <button type="submit" disabled={submitting} className="px-3 py-2 bg-blue-600 text-white rounded">{submitting ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        )}

        <footer className="mt-6 text-xs text-gray-500">Note: This demo uses JSONPlaceholder (<code>/users</code>) which simulates create/update/delete and returns fake success responses. Local state is updated to reflect changes for demo purposes.</footer>
      </div>
    </div>
  );
}


// src/App.jsx// src/App.jsx
// import UserManagement from "../"
// // import { Toaster } from "./components/ui/Toaster"

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Page content */}
//       <UserManagement />

//       {/* Global toaster for notifications */}
//       {/* <Toaster /> */}
//     </div>
//   )
// }

// export default App



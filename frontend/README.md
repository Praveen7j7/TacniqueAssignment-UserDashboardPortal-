# User Management App (React + Tailwind)

A simple **User Management System** built with **React** and **Tailwind CSS** that demonstrates fetching data, client-side CRUD operations, filtering, sorting, searching, pagination, and infinite scrolling.  

This project uses the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) `/users` API for demo purposes. Since JSONPlaceholder does not persist create/update/delete operations, local state is updated to simulate changes.

---

## ✨ Features

- **Fetch Users** from JSONPlaceholder API (`/users`).
- **CRUD Operations**
  - Create new user
  - Edit existing user
  - Delete user  
  (Simulated, persisted only in local state)
- **Pagination**
  - Options: `10`, `25`, `50`, `100` per page
  - Navigate between pages
- **Infinite Scroll** option (toggle between pagination & infinite scrolling).
- **Filtering**
  - Filter by first name, last name, email, and department
- **Search**
  - Global search across name, email, and department
- **Sorting**
  - Sort by ID, first name, last name, email, or department
- **Responsive Table**
  - Optimized for desktop, tablet, and mobile views
- **Client-Side Validation**
  - Validate form inputs before submitting
- **Error Handling**
  - Network/API errors displayed in UI
- **Tailwind CSS**
  - Fully styled using Tailwind utility classes

---

## 🛠 Tech Stack

- **React 18**
- **Tailwind CSS**
- **Fetch API** for HTTP requests
- **JSONPlaceholder** fake REST API

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/user-management-app.git
cd user-management-app
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run development server
```bash
npm run dev
```

Then open: **http://localhost:5173/** (or whichever port Vite/CRA runs on).

---

## 📂 Project Structure

```
src/
├── components/        # Reusable UI components (buttons, inputs, modal, table, etc.)
├── pages/
│   └── UserManagementApp.jsx   # Main user management page
├── App.jsx            # App wiring / layout
├── index.css          # Tailwind styles
└── main.jsx           # Entry point
```

---

## 🖼 UI Preview

- **Main Table View** – Search, Filters, Sorting, Pagination/Infinite scroll  
- **Form Modal** – Add/Edit users with validation  
- **Responsive Layout** – Table hides columns on smaller screens  

---

## ⚠️ Notes

- JSONPlaceholder API **does not persist changes**.  
  - `POST`, `PUT`, and `DELETE` return fake success responses.  
  - Local React state is updated to reflect changes.
- This project is intended as a **demo / coding assignment** to showcase React skills.

---

## ✅ Possible Enhancements

- Connect to a real backend with database persistence
- Add authentication & role-based access
- Export table data (CSV, Excel, PDF)
- Unit and integration testing (Jest/React Testing Library, Cypress)

---

## 📜 License

MIT License © 2025 Your Name  

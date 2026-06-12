# AI Usage Declaration (Updated)

This document outlines the usage of Artificial Intelligence (AI) in the design, architecture, and development of the **Humara Pandit Astrologer CRM & OMS** project.

---

## 🤖 AI System Details

- **Model Used**: Gemini 3.5 Flash (Medium) via Google DeepMind Antigravity Pair-Programming Agent.
- **Role of AI**: Autonomous pair-programming agent, code assistant, and styling architect.

---

## 🛠️ How AI Was Utilized

### 1. Project Planning & Role Mapping
- Redesigned the authentication schema to support two distinct user roles: **Admin** and **Astrologer**.
- Programmed a custom seeding script (`seed.js`) that populates the MongoDB database with:
  - 1 System Admin user.
  - 1 Astrologer user.
  - 12 Client profiles.
  - 12 Scheduled appointments.
  - 8 Consultation timelines (with follow-ups and remedies).
- Connected the seed script to run **automatically on database startup** inside `db.js`, ensuring that the application maps rich mock data instantly when launched.

### 2. Code Generation & Refinement
- **Mongoose User Schema**: Configured `User.js` tracking email, password, and enum roles.
- **Role Routing Controls**: Updated the [App.jsx](file:///D:/humara-pandit-crm/frontend/src/App.jsx) and [Navbar.jsx](file:///D:/humara-pandit-crm/frontend/src/components/Shared/Navbar.jsx) components to conditionally render routes and navigation tabs based on whether the logged-in user is an Admin or an Astrologer.
- **Credentials Autofill**: Added clicking hooks inside the login screen (`Login.jsx`) to prefill inputs and trigger simulated authentication dynamically.

### 3. Documentation & Verification
- Updated the `README.md` containing credential specifications, routing profiles, and auto-seeding notes.
- Compiled Vite production bundles (`npm run build`) in local environments.

---

## 💡 Human Guidance & Oversight

- **Functional Specifications**: Provided the exact demo credentials (email, passwords, roles), requesting automatic DB seeding and a "Login as Admin" / "Login as Astrologer" quick autofill layout.
- **Deployment Structure**: Outlined the routing profiles for Admin (/admin/...) and Astrologer (/astrologer/...) tabs.

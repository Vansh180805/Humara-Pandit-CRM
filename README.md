# 🔮 Humara Pandit - Astrologer CRM & OMS (Order Management System)

A tailored, full-stack Customer Relationship Management (CRM) and Remedy Order Management System (OMS) built to address the business needs of **Humara Pandit (D A Dharm Sathi Private Limited)**. 

This project solves operational challenges in managing client lists, consultation history logs, recommended remedies, and follow-ups.

---

## 🔑 Demo Credentials (Autofill Buttons Available)

To make evaluation convenient, the login screen includes **Autofill Buttons** for the two seeded roles:

### 1. System Administrator
- **Email**: `admin@demo.com`
- **Password**: `Admin@123`
- **Access Tabs**: `/admin/dashboard`, `/admin/clients`, `/admin/appointments` (Accesses scheduling logistics).

### 2. Consulting Astrologer
- **Email**: `astrologer@demo.com`
- **Password**: `Astro@123`
- **Access Tabs**: `/astrologer/dashboard`, `/astrologer/clients`, `/astrologer/consultations` (Accesses session note logging and remedy check-listers).
- *Astrologer registration is fully enabled. Additional users can sign up and log in using their own created credentials.*

---

## 🚀 The 6 MVP Pages (Job Description Aligned)

1. **Login Page**
   - Interactive credentials card with click-to-autofill buttons for Admin and Astrologer accounts.
   - Includes custom toggle to sign up/register new Astrologer accounts dynamically.
2. **Interactive Business Dashboard**
   - Shows the 4 critical business metrics:
     - **Total Clients**: Count of registered clients.
     - **Today's Consultations**: Daily consultation sessions logged.
     - **Upcoming**: Scheduled consultations yet to begin.
     - **Follow-ups**: Total pending client follow-ups.
3. **Client Directory**
   - CRUD Operations: **Add, Edit, Search, and Delete** client profiles.
   - Saves personal birth info: Name, Phone, Email, Date of Birth, Birth Time, and Birth Place.
   - Automatically approximates Moon Rashi on DOB entry.
4. **Client Details Profile**
   - **Personal Info Summary**: Phone, email, birth time/place, calculated sign.
   - **Consultation Timeline**: Historized session notes.
   - **Remedies Aggregation**: Summarized list of all gemstones, rudrakshas, and crystals recommended across previous sessions.
   - **Follow-Up Status**: Upcoming check-in dates and pending/completed status indicators.
5. **Appointment Scheduler (Admin & Astrologer)**
   - Book new consultation slots: Client, Date, Time, and Status (`Scheduled`, `Completed`, `Cancelled`).
6. **Consultation Logs (Astrologer Exclusive)**
   - Record discussion notes (e.g. Vansh worried about placements).
   - Recommend remedies (checklists for Gemstones, Rudrakshas, and Crystals).
   - Log Follow-Up dates and automatically flag them as `Pending`.

---

## 📁 Repository Structure

```
humara-pandit-crm/
├── backend/
│   ├── config/             # DB Config & Auto-Seeding script (seed.js)
│   ├── controllers/        # Express Controllers (Auth, Clients, Consultations, Appointments, Stats)
│   ├── models/             # Mongoose schemas (User, Client, Consultation, Appointment)
│   ├── routes/             # REST Express routes (Auth, Clients, etc.)
│   ├── server.js           # Server boot entrypoint
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/     
    │   │   ├── Clients/    # Client Lists, Details Profile View
    │   │   ├── Dashboard/  # Dashboard Stats
    │   │   ├── Appointments/ # Appointment Slots Scheduler
    │   │   ├── Consultations/ # Log Notes & Remedies
    │   │   └── Shared/     # Navbar, Login Screen (Login.jsx)
    │   ├── services/       # API integration layers (api.js)
    │   ├── App.jsx         # App State Routing & Auth Checking
    │   ├── index.css       # Tailwind directives & custom CSS
    │   └── main.jsx        # Mounting point
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## ⚙️ Installation & Local Setup

### 1. Database Setup
Create a `.env` file inside the `backend/` directory based on `.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
```
*(If no URI is specified, the application will default to connecting to a local MongoDB instance at `mongodb://127.0.0.1:27017/humara_pandit`).*

### 2. Auto-Seeding Database
When the server connects to the database, it checks for existing records. If the database is empty, it **automatically seeds** 2 accounts, 12 clients, 12 appointments, and 8 historical consultation logs. No manual scripting is required!

### 3. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
The backend API will initialize on `http://localhost:5000`.

### 4. Start the Frontend Client
Open a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
The React frontend will spin up on `http://localhost:5173`.

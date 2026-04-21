# Priocare HMS - AI-Powered Hospital Management System

Priocare HMS is a highly responsive, intelligent Hospital Management System designed to streamline operations across the entire hospital ecosystem. It bridges the gap between Patients, Doctors, Receptionists, and Admins by integrating AI-driven triage logic, real-time queues, and precise, automated document generation.

This advanced architectural document provides a detailed breakdown of end-to-end lifecycles and concepts. It is designed to act as the ultimate ground-truth reference for building further reports, auditing workflows, and expanding the platform.

---

## 🌟 Core Concepts & User Lifecycles

The system revolves around structured, role-based workflows (RBAC) securely isolated using JWT auth and hashed credentials. The following lifecycles represent the end-to-end journey of each user type within Priocare HMS.

### 1. 🧍‍♂️ Patient Lifecycle

The Patient's journey focuses on eliminating wait-time uncertainty and empowering them with instant access to their health records.

1. **Onboarding & Auth:** The Patient registers, verifies their identity via an OTP emailed through the Resend API, and is placed into the `PatientLayout`.
2. **AI-Driven Intake (Triage):**
   - The Patient initiates an appointment request. Instead of directly picking a slot, they converse with the **Assistant Module**.
   - The AI Assistant (powered by Google Gemini) collects input parameters: `symptoms`, `age`, `vitals` (heart rate, blood pressure, temperature), and boolean `comorbidities`.
   - Based on this data, the AI generates a `priorityScore` and a `severityLevel` (Low, Medium, High, Emergency) and recommends a specialized Doctor.
3. **Dynamic Queuing & Tokens:** The Patient is matched with a Doctor via the `DoctorAssign Service` and issued an Appointment Token. From their dashboard, the Patient monitors their live token position without needing to refresh the page.
4. **Consultation & Discharge:**
   - They wait until their token is "Called" by the Doctor.
   - Upon completion, the consultation concludes, and the Patient instantly receives a notification (via Socket.io) presenting the **Final Report and Prescription**.

### 2. 👩‍💼 Receptionist Lifecycle

The Receptionist acts as the hospital's physical traffic controller, shifting token states from "expected" to "present".

1. **Dashboard Monitoring:** The Receptionist authenticates and accesses the `ReceptionistLayout`. The dashboard displays all scheduled appointments grouped by Doctor or Priority.
2. **Patient Verification (Walk-Ins):** When the Patient arrives, the Receptionist captures their Token.
3. **Check-In Execution:**
   - The Receptionist verifies the token and clicks "Check-In" in the Receptionist Module.
   - The Backend routes this to the `Receptionist Controller`, updating the Appointment's status to `checked_in`.
4. **Real-Time Propagation:** As soon as the Receptionist commits the check-in, a Socket.io event (`emit refresh`) is fired. This instantly reorders the assigned Doctor's active queue, placing the Patient in the "Waiting Room" pool based on their AI Priority Score.

### 3. 👨‍⚕️ Doctor Lifecycle

The Doctor's workflow is heavily augmented by AI to drastically minimize manual documentation overhead, allowing more face-time with the Patient.

1. **Intelligent Queue View:** Viewing the `DoctorLayout`, the Doctor sees an ordered patient queue handled by the `DoctorQueue Service`. _Emergency_ statuses bypass all lower-tier patients automatically.
2. **Call Next:** The Doctor clicks "Call Next". The backend updates the appointment status to `called`, firing Socket.io events. The Receptionist and Patient dashboards glow/ring to indicate it's time for the patient to enter the consultation room.
3. **The Consultation & "Final Report" Generation:**
   - The Doctor begins the assessment, quickly inputting shorthand notes, vitals changes, and selected medication (`Medicine` schema items).
   - Once the Doctor hits "End Consultation", the `Doctor Controller` wraps the payload and delegates it to the **AI Adapter (`config/gemini.config.js`)**.
   - **The AI Process:** Gemini translates the shorthand into a structured **"Final Report"**. This report converts disjointed notes into a comprehensive, legally legible Medical Summary detailing Diagnosis, Prescribed Medicines regimens, Dietary constraints, and Follow-up Instructions.
   - The AI output is mapped to the `Prescription` Mongoose schema and permanently linked to the `Appointment`.
4. **Discharge Distribution:** The final report is saved to MongoDB, appended to the Patient's medical history timeline, and optionally emailed using the Resend API.

### 4. 🛡️ Admin/Management Lifecycle

The Admin governs the ecosystem, assessing capacity and authorizing staff.

1. **Staff Onboarding:** Admin handles the secure registration of Doctors and Receptionists to ensure bad actors cannot create medical personnel accounts.
2. **Data Oversight & Statistics:** The `Admin Controller` pulls aggregations (e.g., peak patient times, appointment completion rates) via `api/v1/admin/stats`. This creates the administrative **Final System Reports** necessary for scaling hospital operations and evaluating AI triage accuracy.

---

## 🏗️ Technical Architecture & Data Flows

### End-to-End Data Flow

1. **Client -> Server:** React Vite Frontend (via Redux Toolkit slices) issues an HTTP request or fires a Socket event.
2. **Gateway:** The Express API routes the request through JWT `Auth Middleware` and `Joi/Validator` schema validation.
3. **Controllers & Services:** The Controller validates the request context and offloads heavy lifting (database access, priority sorting, AI prompting) to the Service layer.
4. **AI & DB Processing:** If applicable, external requests are made to Cloudinary (image assets), Google GenAI/OpenRouter (LLM structuring), or MongoDB (transactions).
5. **Real-Time Return:** Database modifications trigger a Socket.io broadcast emitted back to all subscribed Clients, forcing an immediate, seamless UI re-render on the React application without a hard refresh.

### Stack Breakdown

- **Frontend Stack:** React 19, Vite, Redux Toolkit, Tailwind CSS, Framer Motion, Socket.io-client.
- **Backend Stack:** Node.js, Express.js, MongoDB (Mongoose ODM), Socket.io, Google GenAI, Cloudinary, Resend API.

---

## 📁 Project Structure

```text
priocare_HMS/
├── backend/
│   ├── api/v1/          # Modularized routes and controllers separated by roles
│   │   ├── admin/       # Management of doctors, receptionists, patients, stats
│   │   ├── appointments/# Triage, Doctor Assignment, Doctor Queue processing
│   │   ├── assistant/   # AI Chat/Intake logic connected to Gemini config
│   │   ├── auth/        # Login, registration, OTP validations
│   │   ├── doctors/     # Doctor features, handling prescriptions and status updates
│   │   └── receptionists/ # Patient Check-ins and token generation
│   ├── config/          # Configurations for Cloudinary, DB, Email, Gemini AI
│   ├── middlewares/     # JWT Auth verifiers, Error handling, Joi Data Validation
│   ├── models/          # Mongoose Schema Definitions (User, Patient, Doctor, Appointment, Prescription, Medicine)
│   ├── utils/           # Helper utilities (Socket setup, error wrappers, day range math)
│   └── server.js        # Entry point for backend HTTP and Socket.io server
├── frontend/
│   ├── src/
│   │   ├── app/         # Redux Store (`store.js`) and Layouts/Routes
│   │   ├── components/  # Reusable UI widgets and role-specific components
│   │   ├── features/    # Redux slices/API services divided by roles (admin, auth, doctor...)
│   │   ├── pages/       # High-level route pages (EntryPage, HeroSection)
│   │   ├── services/    # External API abstractions and Socket.io client bindings
│   │   └── utils/       # Client-side utility functions (e.g. Local Storage wrappers)
│   └── index.html       # Vite HTML entry
└── docs/                # Application DFDs, flows, and system architecture docs
```

---

## 🚀 Setup & Installation

### Prerequisite Checklist

- Node.js (v18+)
- MongoDB connection string (Local or Atlas)
- Configuration APIs (Cloudinary, Resend, Google Gemini)

### 1. Backend Initialization

```bash
cd backend
npm install
```

**Environment Variables `.env`:**

```env
PORT=5000
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret
RESEND_API_KEY=your_resend_key
CLOUDINARY_URL=your_cloudinary_url
GEMINI_API_KEY=your_gemini_key
```

```bash
# Seed Database with Initial Admin and Medicine data (Optional but recommended)
node scripts/seedAdmin.js
node scripts/seedMedicines.js

# Start server
npm run dev
```

### 2. Frontend Initialization

```bash
cd frontend
npm install
```

**Environment Variables `.env`:**

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

```bash
# Start Vite development server
npm run dev
```

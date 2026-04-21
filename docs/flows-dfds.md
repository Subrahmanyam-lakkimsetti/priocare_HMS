# Priocare HMS - Flows and DFDs (All Levels)

This document captures system flows and data flow diagrams (DFDs) derived from the current backend codebase. It uses Mermaid flowcharts to represent DFDs at multiple levels.

## Level 0 - Context DFD

```mermaid
flowchart LR
  Patient[Patient] -->|HTTP requests| System((Priocare HMS API))
  Doctor[Doctor] -->|HTTP requests| System
  Receptionist[Receptionist] -->|HTTP requests| System
  Admin[Admin] -->|HTTP requests| System

  System -->|Responses| Patient
  System -->|Responses| Doctor
  System -->|Responses| Receptionist
  System -->|Responses| Admin

  System -->|Email| EmailService[Resend Email API]
  System -->|AI prompts| AiService[Gemini / OpenRouter]
  System -->|Media upload| Cloudinary[Cloudinary]
  System -->|Realtime events| SocketClients[Socket.io Clients]

  System <--> DB[(MongoDB)]
```

## Level 1 - Core Modules DFD

```mermaid
flowchart TB
  subgraph External
    Patient[Patient]
    Doctor[Doctor]
    Receptionist[Receptionist]
    Admin[Admin]
  end

  subgraph PriocareAPI[Priocare HMS API]
    Auth(Auth Module)
    Patients(Patient Module)
    Doctors(Doctor Module)
    Appts(Appointment Module)
    Assistant(Assistant Module)
    Reception(Receptionist Module)
    AdminMod(Admin Module)
    Realtime(Realtime Notifications)
    Media(Media Uploads)
    Ai(AI Adapter)
    Email(Email Sender)
  end

  subgraph Stores[Data Stores]
    Users[(User)]
    PatientsDB[(Patient)]
    DoctorsDB[(Doctor)]
    ApptsDB[(Appointment)]
    PrescDB[(Prescription)]
    AssistDB[(AssistantConversation)]
    OtpDB[(OTP)]
    ReceptDB[(Receptionist)]
    MedsDB[(Medicine)]
  end

  Patient --> Auth
  Patient --> Patients
  Patient --> Appts
  Patient --> Assistant

  Doctor --> Doctors
  Doctor --> Appts
  Doctor --> Assistant

  Receptionist --> Reception
  Receptionist --> Appts

  Admin --> AdminMod

  Auth --> Users
  Auth --> OtpDB

  Patients --> PatientsDB
  Doctors --> DoctorsDB
  Reception --> ReceptDB

  Appts --> ApptsDB
  Appts --> PrescDB
  Appts --> DoctorsDB
  Appts --> PatientsDB

  Assistant --> AssistDB
  Assistant --> PatientsDB
  Assistant --> ApptsDB
  Assistant --> PrescDB

  Doctors --> PrescDB
  Doctors --> ApptsDB

  AdminMod --> Users
  AdminMod --> DoctorsDB
  AdminMod --> ReceptDB
  AdminMod --> PatientsDB
  AdminMod --> ApptsDB

  Appts --> Ai
  Assistant --> Ai

  Appts --> Email
  Auth --> Email

  Patients --> Media
  Doctors --> Media

  Appts --> Realtime
  Doctors --> Realtime
  Reception --> Realtime

  Realtime --> Patient
  Realtime --> Doctor
  Realtime --> Receptionist
```

## Level 2 - Auth Flow DFD

```mermaid
flowchart LR
  User[User] -->|register/login| AuthAPI((Auth Controller))
  AuthAPI -->|validate payload| Validation[Validation Middleware]
  AuthAPI -->|create or verify| AuthService[Auth Service]
  AuthService --> Users[(User)]
  AuthService --> Otp[(OTP)]
  AuthService -->|send OTP / reset| Email[Resend Email API]
  AuthAPI -->|set cookie token| Cookie[JWT Cookie]
  AuthAPI --> User
```

## Level 2 - Appointment Creation (Patient) DFD

```mermaid
flowchart TB
  Patient[Patient] -->|POST /appointments| ApptCtrl((Appointment Controller))
  ApptCtrl --> ApptSvc[Appointment Service]
  ApptSvc -->|evaluate triage| Ai[AI Adapter]
  Ai --> ApptSvc
  ApptSvc -->|assign doctor| AssignSvc[Doctor Assign Service]
  AssignSvc --> Doctors[(Doctor)]
  ApptSvc -->|create appointment| Appts[(Appointment)]
  ApptSvc --> Patients[(Patient)]
  ApptSvc --> Users[(User)]
  ApptSvc -->|send confirmation| Email[Resend Email API]
  ApptSvc -->|emit updates| Realtime[Socket.io]
  ApptCtrl --> Patient
```

## Level 2 - Appointment Lifecycle (Receptionist and Doctor) DFD

```mermaid
flowchart LR
  Receptionist[Receptionist] -->|check-in token| ReceptionCtrl((Receptionist Controller))
  ReceptionCtrl --> Appts[(Appointment)]
  ReceptionCtrl -->|emit refresh| Realtime[Socket.io]

  Doctor[Doctor] -->|get queue| DoctorCtrl((Doctor Controller))
  DoctorCtrl --> QueueSvc[Doctor Queue Service]
  QueueSvc --> Appts

  Doctor -->|call next| DoctorCtrl
  DoctorCtrl --> DoctorSvc[Doctor Service]
  DoctorSvc --> Appts
  DoctorSvc -->|notify patient| Realtime
  DoctorSvc -->|email called| Email[Resend Email API]

  Doctor -->|start consult| DoctorCtrl
  DoctorCtrl --> DoctorSvc
  DoctorSvc --> Appts

  Doctor -->|end consult| DoctorCtrl
  DoctorCtrl --> DoctorSvc
  DoctorSvc --> Appts
  DoctorSvc --> Presc[(Prescription)]
  DoctorSvc -->|ai summary| Ai[AI Adapter]
  DoctorSvc -->|emit summary| Realtime
```

## Level 2 - Assistant Chat and Escalation DFD

```mermaid
flowchart TB
  Patient[Patient] -->|ask / intake| AsstCtrl((Assistant Controller))
  AsstCtrl --> AsstSvc[Assistant Service]
  AsstSvc --> Patients[(Patient)]
  AsstSvc --> Appts[(Appointment)]
  AsstSvc --> Presc[(Prescription)]
  AsstSvc -->|compose prompt| Ai[AI Adapter]
  Ai --> AsstSvc
  AsstSvc --> AssistDB[(AssistantConversation)]
  AsstSvc -->|escalate if needed| Realtime[Socket.io]
  AsstCtrl --> Patient

  Staff[Doctor/Receptionist/Admin] -->|view/resolve escalations| AsstCtrl
  AsstCtrl --> AsstSvc
  AsstSvc --> AssistDB
```

## Level 2 - Admin Management DFD

```mermaid
flowchart LR
  Admin[Admin] -->|manage staff/patients/appointments| AdminCtrl((Admin Controllers))
  AdminCtrl --> Users[(User)]
  AdminCtrl --> Doctors[(Doctor)]
  AdminCtrl --> Patients[(Patient)]
  AdminCtrl --> Recept[(Receptionist)]
  AdminCtrl --> Appts[(Appointment)]
  AdminCtrl --> Admin
```

## Notes on Cross-Cutting Concerns

- Auth: JWT cookies set on login/register; role checks via `restrictTo` middleware.
- Validation: Joi-based `validateInput` middleware gates payloads.
- Media: Profile photo uploads via `multer` to Cloudinary.
- Realtime: Socket.io rooms by role and user id; emits refresh and AI summary updates.
- AI: Gemini primary with OpenRouter fallback; used for triage, summaries, assistant.
- Email: Resend sends OTP, password reset, and appointment notifications.

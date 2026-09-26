# MediCare – Online Healthcare Management Platform 🏥

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-6.x-blue.svg)](https://spring.io/projects/spring-security)
[![JWT](https://img.shields.io/badge/JWT-Authentication-black.svg)](https://jwt.io/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Containers-2496ed.svg)](https://www.docker.com/)

**MediCare** is a production-ready, full-stack healthcare management web application designed as an academic capstone and industry-standard portfolio project. It connects patients with verified specialist doctors, automates appointment booking workflows with strict double-booking prevention, enables digital prescription generation, manages electronic medical records, and provides comprehensive administrative controls.

---

## 🏗️ System Architecture & Stack

```text
               ┌──────────────────────────────────────────────┐
               │    React.js + TypeScript (Vite Single Page)  │
               └──────────────────────┬───────────────────────┘
                                      │ REST API (JSON / JWT)
                                      ▼
               ┌──────────────────────────────────────────────┐
               │         Java Spring Boot 3 REST Server       │
               │   (Spring Security 6, JWT Filter, Controllers)│
               └──────────────────────┬───────────────────────┘
                                      │ Spring Data JPA / Hibernate
                                      ▼
               ┌──────────────────────────────────────────────┐
               │      Relational Database (H2 / MySQL)        │
               └──────────────────────────────────────────────┘
```

* **Frontend:** React 18, TypeScript, React Router 6, Axios, Lucide React Icons, Vanilla CSS Design System.
* **Backend:** Java 17, Spring Boot 3.2.4, Spring Security 6, JWT (`io.jsonwebtoken:jjwt`), Spring Data JPA, Hibernate, Bean Validation (`jakarta.validation`), Lombok.
* **Database:** H2 (In-memory for instant zero-config dev/demo), MySQL 8 (Production & Docker).
* **API Documentation:** Swagger / OpenAPI 3.0 via `springdoc-openapi-starter-webmvc-ui`.
* **Testing:** JUnit 5, Mockito, Spring Boot Test, MockMvc.
* **Containerization:** Docker & Docker Compose.

---

## ✨ Key Features by Role

### 🏥 Patient Module
* **Registration & JWT Login:** Secure authentication with BCrypt hashed passwords.
* **Doctor Search & Filtering:** Filter specialist doctors by specialization (Cardiology, Neurology, Dermatology, Pediatrics, Orthopedics, General Physician) and search by name.
* **Appointment Booking Workflow:** Select doctor, date, and time slot. Prevents double-booking of doctor slots.
* **Appointment Cancellation:** Cancel upcoming pending or confirmed appointments.
* **Digital Prescriptions:** View and print prescriptions issued by consulting doctors.
* **Electronic Medical Records:** Upload and maintain personal lab reports, X-rays, and medical history.
* **Personal Profile:** Update contact info, blood group, DOB, emergency contact, and allergies.

### 🩺 Doctor Module
* **Doctor Verification & Profile:** Set qualifications, consultation fee, experience years, and bio.
* **Weekly Availability Schedule:** Configure working days, start/end hours, max patient limits, and slot durations.
* **Appointment Management:** Accept or reject incoming patient appointment requests.
* **Consultation Notes:** Record clinical examination notes and doctor observations.
* **Digital Rx Prescriptions:** Create digital prescriptions (diagnosis, medicines, dosages, instructions) linked directly to completed consultations.
* **Patient History Directory:** Review past medical history and consultation history of patients.

### 🛡️ Admin Module
* **Dashboard Statistics:** Real-time metrics for total patients, total doctors, pending doctor approvals, total appointments, completed consultations, and cancellations.
* **Doctor Verification:** Approve or reject doctor registrations before they can take online bookings.
* **User Access Control:** Enable or disable user accounts across the platform with 1-click status toggles.
* **System-Wide Appointments Log:** Inspect master log of all patient-doctor consultations.

---

## ⚡ Quick Demo 1-Click Credentials

For instant demonstration and testing, the application automatically seeds the database with demo accounts:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@medicare.com` | `admin123` | Full Administrative Access |
| **Doctor** | `dr.smith@medicare.com` | `doctor123` | Senior Cardiologist |
| **Doctor** | `dr.johnson@medicare.com` | `doctor123` | Consultant Neurologist |
| **Doctor** | `dr.emily@medicare.com` | `doctor123` | Dermatologist Specialist |
| **Patient** | `john.doe@gmail.com` | `patient123` | Sample Patient |
| **Patient** | `sarah.connor@gmail.com` | `patient123` | Sample Patient |

---

## 🗄️ Database Schema & Relational Design

```text
users (id, email, password, full_name, phone, role, enabled, created_at, updated_at)
  │
  ├── 1:1 ──> patients (id, user_id, gender, date_of_birth, blood_group, address, emergency_contact, medical_history)
  │
  └── 1:1 ──> doctors (id, user_id, specialization, qualification, experience_years, consultation_fee, bio, status, created_at)
                │
                ├── 1:N ──> doctor_availability (id, doctor_id, day_of_week, start_time, end_time, max_patients, slot_duration_minutes)
                │
                └── 1:N ──> appointments (id, patient_id, doctor_id, appointment_date, time_slot, status, reason, consultation_notes)
                              │
                              └── 1:1 ──> prescriptions (id, appointment_id, doctor_id, patient_id, diagnosis, medicines, instructions, issued_date)

medical_records (id, patient_id, doctor_id, title, record_type, file_url, notes, record_date, created_at)
notifications (id, user_id, title, message, is_read, created_at)
```

---

## 📡 REST API Endpoint Documentation

| Method | Endpoint | Description | Role / Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new patient or doctor | Public |
| `POST` | `/api/auth/login` | Login user & receive JWT token | Public |
| `GET` | `/api/auth/me` | Fetch current authenticated user info | Authenticated |
| `GET` | `/api/doctors` | Search & filter doctors | Public |
| `GET` | `/api/doctors/{id}` | Get doctor details by ID | Public |
| `PUT` | `/api/doctors/profile` | Update doctor profile & fee | Doctor |
| `GET` | `/api/doctors/{id}/availability` | Get doctor weekly schedule | Public |
| `POST` | `/api/doctors/availability` | Update doctor weekly schedule | Doctor |
| `POST` | `/api/appointments` | Book new appointment | Patient |
| `GET` | `/api/appointments/my` | Get my appointments | Patient / Doctor / Admin |
| `PUT` | `/api/appointments/{id}/status` | Accept / Reject / Complete appointment | Doctor / Admin |
| `DELETE` | `/api/appointments/{id}` | Cancel appointment | Patient |
| `POST` | `/api/prescriptions` | Create digital prescription | Doctor |
| `GET` | `/api/prescriptions/my` | Get my prescriptions | Patient / Doctor |
| `GET` | `/api/medical-records/my` | Get patient medical records | Patient / Doctor |
| `POST` | `/api/medical-records` | Upload medical record | Patient / Doctor |
| `GET` | `/api/admin/dashboard` | Admin dashboard statistics | Admin |
| `GET` | `/api/admin/users` | List all system users | Admin |
| `PUT` | `/api/admin/users/{id}/status` | Enable / Disable user account | Admin |
| `PUT` | `/api/admin/doctors/{id}/status`| Approve / Reject doctor registration | Admin |

---

## 🚀 Local Development Setup Guide

### Prerequisites
* **Java Development Kit (JDK 17+)**
* **Node.js (v18+) & npm (v9+)**

### 1. Backend Setup & Startup
```bash
cd backend

# Clean & run Spring Boot application using Maven Wrapper
./mvnw clean spring-boot:run
```
* Backend REST API will start at: `http://localhost:8080`
* H2 Database Console available at: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:medicaredb`)
* Interactive Swagger UI available at: `http://localhost:8080/swagger-ui.html`

### 2. Frontend Setup & Startup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite React development server
npm run dev
```
* React Frontend will start at: `http://localhost:3000`

---

## 🐳 Docker Deployment Guide

The platform includes multi-stage Dockerfiles and `docker-compose.yml` for complete containerized deployment (MySQL + Backend + NGINX Frontend).

```bash
# Build and launch all container services
docker compose up --build
```

Services created:
* `medicare-mysql`: MySQL 8 Database on port `3306`
* `medicare-backend`: Java Spring Boot API on port `8080`
* `medicare-frontend`: NGINX web server serving React app on port `80`

To stop containers:
```bash
docker compose down -v
```

---

## 🧪 Unit & Integration Testing

The backend includes test coverage using JUnit 5, Mockito, and Spring Security Test:

```bash
cd backend
./mvnw test
```

Test classes cover:
* `AuthServiceTest`: User registration, JWT login, duplicate email handling.
* `DoctorServiceTest`: Doctor profile updates and status filtering.
* `AppointmentServiceTest`: Appointment booking & **double-booking prevention logic**.
* `PrescriptionServiceTest`: Prescription creation & auto-completing appointments.
* `AdminServiceTest`: Dashboard statistics calculations.

---

## 🌿 Git Branch Structure

```text
main                      -> Production-ready release branch
└── develop               -> Integration development branch
    ├── feature/authentication
    ├── feature/appointments
    ├── feature/doctor-module
    ├── feature/patient-module
    └── feature/admin-module
```

---

## 🎓 HCL Capstone Project Deliverables Checklist

- [x] Full-stack architecture: **React (TS) → REST API → Spring Boot → Spring Data JPA → Database**
- [x] Three Role Security: **Patient, Doctor, Admin** with Spring Security & JWT
- [x] Double-Booking Prevention Algorithm for Doctor time slots
- [x] Complete REST API Suite with JSON DTOs and Global Exception Handling
- [x] Swagger / OpenAPI 3.0 Interactive Documentation with Bearer JWT Auth
- [x] Unit & Integration Tests using JUnit 5 and Mockito
- [x] Dockerization (`Dockerfile` for Backend & Frontend, `docker-compose.yml`)
- [x] Modular Project Structure & Clean Code Principles

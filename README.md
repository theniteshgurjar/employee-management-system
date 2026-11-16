# 🏢 Enterprise Employee Management System (EMS) — 2026

An enterprise-grade, full-stack Human Capital and Employee Management System built from scratch with **Java 17/21**, **Spring Boot 3**, **Spring Security (JWT & RBAC)**, **Spring Data JPA**, **PostgreSQL 18**, and **React 18**.

Designed following clean domain-driven architecture: **Controller &rarr; Service &rarr; Repository &rarr; Database**.

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Technology Stack](#-technology-stack)
3. [System Architecture](#-system-architecture)
4. [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
5. [Database Design & Schema](#-database-design--schema)
6. [Core Enterprise Features](#-core-enterprise-features)
7. [Installation & Setup Guide](#-installation--setup-guide)
   - [Prerequisites](#prerequisites)
   - [Running the PostgreSQL Database](#1-running-the-postgresql-database)
   - [Running the Spring Boot Backend](#2-running-the-spring-boot-backend)
   - [Running the React Frontend](#3-running-the-react-frontend)
   - [Running via Docker Compose](#4-running-via-docker-compose)
8. [API Documentation (Swagger / OpenAPI)](#-api-documentation-swagger--openapi)
9. [Demo Test Credentials](#-demo-test-credentials-for-development--interviews)
10. [Testing & Quality Assurance](#-testing--quality-assurance)

---

## 🌟 Project Overview

The Employee Management System (EMS) solves core enterprise HR operational challenges by automating employee records lifecycle, organizational departments, daily attendance punch-in/out tracking with hour calculations, and automated multi-tier leave quota approvals with complete audit histories.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend Framework** | Java 17 / 21 LTS, Spring Boot 3.2.5 |
| **Security & Auth** | Spring Security 6, JWT (io.jsonwebtoken JJWT 0.12.5), BCrypt Password Hashing |
| **Persistence / ORM**| Spring Data JPA, Hibernate, HikariCP |
| **Database** | PostgreSQL 18 |
| **Validation & Docs** | Jakarta Bean Validation, Springdoc OpenAPI 3 / Swagger UI |
| **Frontend UI** | React 18, React Router v6, Axios, Lucide Icons, Enterprise CSS3 |
| **DevOps & Containers**| Docker, Docker Compose, Nginx Alpine Multi-Stage Builds |
| **Testing** | JUnit 5, Mockito, Spring Security Test, AssertJ |
| **Version Control** | Git & GitHub |

---

## 🏛️ System Architecture

The application enforces a decoupled 3-tier architecture with stateless token-based authorization:

```
+-------------------------------------------------------------------------+
|                          REACT 18 FRONTEND                              |
|   (AuthContext, Protected Routes, Axios Interceptor, Enterprise Pages)  |
+-----------------------------------+-------------------------------------+
                                    | HTTP Requests (Bearer JWT)
                                    v
+-------------------------------------------------------------------------+
|                        SPRING BOOT 3 REST API                           |
|                                                                         |
|  [Security Filter Chain]  --> Validates Bearer JWT Token                |
|           |                                                             |
|           v                                                             |
|  [Controller Layer]       --> Request Mapping, DTO Validation, Swagger  |
|           |                                                             |
|           v                                                             |
|  [Service Layer]          --> Business Rules, Transactions (@Transactional)|
|           |                                                             |
|           v                                                             |
|  [Repository Layer]       --> Spring Data JPA / Hibernate Querying      |
+-----------------------------------+-------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                        POSTGRESQL 18 DATABASE                           |
|       (Users, Roles, Employees, Departments, Attendance, Leaves)        |
+-------------------------------------------------------------------------+
```

---

## 🛡️ Role-Based Access Control (RBAC)

The system defines four distinct organizational roles with strict method-level (`@PreAuthorize`) and route-level guards:

| Capability / Resource | ADMIN | HR | MANAGER | EMPLOYEE |
| :--- | :---: | :---: | :---: | :---: |
| Full System & User Role Provisioning | ✅ | ❌ | ❌ | ❌ |
| Create / Edit / Deactivate Employees | ✅ | ✅ | ❌ | ❌ |
| Manage Departments & Org Codes | ✅ | ✅ | ❌ | ❌ |
| View Company-Wide Daily Attendance | ✅ | ✅ | ❌ | ❌ |
| View Direct Team Members | ✅ | ✅ | ✅ | ❌ |
| Review & Authorize Team Leaves | ✅ | ✅ | ✅ | ❌ |
| View Personal Profile & Attendance History | ✅ | ✅ | ✅ | ✅ |
| Daily Punch-In & Punch-Out | ✅ | ✅ | ✅ | ✅ |
| Apply for Leave & Check Remaining Quota | ✅ | ✅ | ✅ | ✅ |

---

## 🗄️ Database Design & Schema

PostgreSQL tables engineered with strict foreign key constraints, indexes, and unique business integrity rules:

```
[roles] <---- (user_roles) ----> [users]
                                   | (1:1)
                                   v
[departments] <---- (N:1) ---- [employees] <---- (Self N:1 Manager)
                                   |
           +-----------------------+-----------------------+
           | (1:N)                 | (1:N)                 | (1:N)
           v                       v                       v
     [attendance]            [leave_balances]       [leave_requests]
                                                           | (1:N)
                                                           v
                                                [leave_approval_history]
```

### Table Definitions & Business Rules:
1. **`users`**: Stores credentials (`username`, `email`, `password` encrypted via BCrypt, `enabled`).
2. **`roles`**: System authority roles (`ROLE_ADMIN`, `ROLE_HR`, `ROLE_MANAGER`, `ROLE_EMPLOYEE`).
3. **`user_roles`**: Many-to-Many junction table connecting users to security roles.
4. **`departments`**: Unique `department_code` (e.g. `ENG`, `HR`, `OPS`) and metadata.
5. **`employees`**: Employee code, contact details, DOB, joining date, designation, status, department foreign key, and self-referencing `manager_id`.
6. **`attendance`**: Daily records with `UNIQUE (employee_id, attendance_date)`. Prevents duplicate check-ins on the same day.
7. **`leave_balances`**: Tracks remaining balances per employee per calendar year (`casualLeaveBalance`, `sickLeaveBalance`, `earnedLeaveBalance`, `unpaidLeaveUsed`).
8. **`leave_requests`**: Time-off applications with start/end dates, total days, category, and review status.
9. **`leave_approval_history`**: Immutable audit log of each decision (approve, reject, cancel), reviewer employee ID, comments, and timestamps.

---

## ⚡ Core Enterprise Features

- **JWT Authentication**: Secure stateless authentication using `io.jsonwebtoken` (JJWT) with HMAC-SHA256 signing and expiration validation.
- **Transactional Leave Engine**:
  - Validates quota balance before accepting a request.
  - Detects and rejects overlapping leave dates for the same employee.
  - Prevents employees from self-approving their own leave applications.
  - Automatically deducts quota upon manager approval.
  - Restores quota if an approved leave is cancelled prior to start date.
- **Attendance Timeclock**:
  - Duplicate check-in prevention.
  - Calculates net working hours upon check-out.
  - Automatically flags half-day if completed hours are below 4 hours.
- **Enterprise UI**:
  - React 18 single-page application with customized responsive CSS.
  - One-click demo credential autofill for fast interview demonstrations.

---

## 🚀 Installation & Setup Guide

### Prerequisites
- **Java JDK 17 or 21 LTS** installed.
- **Node.js LTS (v18+) and npm** installed.
- **PostgreSQL 18** installed locally or running via Docker.
- **Git** installed.

---

### 1. Running the PostgreSQL Database

Create the PostgreSQL database named `ems_db`:
```bash
# Connect to PostgreSQL via psql or pgAdmin
CREATE DATABASE ems_db;
```

---

### 2. Running the Spring Boot Backend

Navigate to the `backend/` directory:
```bash
cd backend
```

Configure your PostgreSQL credentials in `src/main/resources/application.yml` or set environment variables:
```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/ems_db
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=postgres
```

Build and run using the Maven:
```bash
mvn clean spring-boot:run
```
*The backend REST API will start on `http://localhost:8080`.*
*Database tables, roles, default departments, and demo accounts are automatically initialized on first startup!*

---

### 3. Running the React Frontend

Open a new terminal and navigate to the `frontend/` directory:
```bash
cd frontend
npm install
npm start
```
*The React application will launch in your browser at `http://localhost:3000`.*

---

### 4. Running via Docker Compose

To build and run the entire full-stack system (PostgreSQL + Spring Boot Backend + React Frontend + Nginx) with a single command:

```bash
docker compose up --build
```

- React Frontend: `http://localhost:3000`
- Spring Boot Backend: `http://localhost:8080`
- Swagger Documentation: `http://localhost:8080/swagger-ui.html`
- PostgreSQL: `localhost:5432`

---

## 📖 API Documentation (Swagger / OpenAPI)

Interactive Swagger UI documentation is available at:
```
http://localhost:8080/swagger-ui.html
```
OpenAPI JSON Specification:
```
http://localhost:8080/v3/api-docs
```

### Testing Protected Endpoints in Swagger:
1. Send a POST request to `/api/auth/login` with your username and password.
2. Copy the `token` string from the response JSON.
3. Click the **Authorize** button at the top of the Swagger UI page.
4. Paste the JWT token into the `bearerAuth` field and click **Authorize**.
5. All protected endpoints can now be executed directly from the Swagger UI!

---

## 🔑 Demo Test Credentials (For Development & Interviews)

The system automatically initializes demo accounts on startup:

| Role | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **👑 ADMIN** | `admin` | `admin123` | Full administrative control, system settings, user roles |
| **💼 HR** | `hr_lead` | `hr123` | Employee onboarding, department configuration, all leaves |
| **📊 MANAGER** | `manager` | `manager123` | Direct team oversight and team leave approval/rejection |
| **👤 EMPLOYEE**| `john_doe` | `employee123`| Self check-in/out, leave applications, personal profile |

*(Tip: On the React login page at `http://localhost:3000/login`, you can click the quick demo buttons to auto-fill these credentials instantly!)*

---

## 🧪 Testing & Quality Assurance

Unit and integration tests are written using JUnit 5 and Mockito. To execute the test suite:

```bash
cd backend
mvn test
```

Tested scenarios include:
- Leave application quota validation and insufficient balance handling.
- Overlapping leave prevention algorithm.
- Approval workflow, authorization checks, and balance deduction.
- Self-approval security denial.
- Attendance check-in duplicate prevention and work duration calculation.
- Safe department deletion preventing orphan employee records.
- Employee creation, unique code enforcement, and soft deactivation.

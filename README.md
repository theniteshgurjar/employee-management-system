# Employee Management System (EMS) - Enterprise 2026

An enterprise-grade, full-stack Employee Management System built with **Java 17 / 21**, **Spring Boot 3**, **Spring Security (JWT & RBAC)**, **Spring Data JPA & PostgreSQL**, and **React 18**.

---

## 🏛️ System Architecture

The application is structured into a modern multi-tier decoupled architecture:

```
[ React 18 Frontend ]  <--- HTTP REST (JSON + JWT Bearer) --->  [ Spring Boot Backend ]
   (Port 3000)                                                        (Port 8080)
                                                                           |
                                                                  (Spring Data JPA)
                                                                           |
                                                                           v
                                                                 [ PostgreSQL Database ]
                                                                      (Port 5432)
```

### Backend Flow:
$$\text{HTTP Request} \longrightarrow \text{Security Filter (JWT)} \longrightarrow \text{Controller} \longrightarrow \text{Service Layer} \longrightarrow \text{Repository (JPA)} \longrightarrow \text{PostgreSQL}$$

---

## 🚀 Key Modules & Capabilities

1. **Role-Based Access Control (RBAC)**:
   - `ADMIN`: Full system control, role assignments, department operations, audit logs.
   - `HR`: Employee onboarding, department management, attendance tracking, leave reviews.
   - `MANAGER`: Team oversight, direct-report leave approval/rejection.
   - `EMPLOYEE`: Personal profile, self check-in/out, leave applications and balance checks.
2. **Employee Management**:
   - Complete CRUD operations, department mapping, manager hierarchies, contact records.
3. **Department Management**:
   - Department lifecycle, budget/code designations, department-wise employee listings.
4. **Attendance Management**:
   - Daily punch-in/punch-out, automatic working hour calculation, duplicate prevention.
5. **Leave Management**:
   - Casual, Sick, Earned, and Unpaid leave allocations with strict transactional integrity (prevents overlapping dates, self-approval, negative balances).
6. **API Documentation**:
   - Interactive Swagger/OpenAPI documentation at `/swagger-ui/index.html`.

---

## 🛠️ Technology Stack

- **Backend**: Java 17 / 21, Spring Boot 3, Spring Security, Spring Data JPA, Hibernate, JWT, Maven.
- **Database**: PostgreSQL 18.
- **Frontend**: React 18, React Router v6, Axios, Lucide Icons, Modern CSS3.
- **DevOps**: Docker, Docker Compose, Git.

---

## 📂 Project Structure

```
employee-management-system/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ems/
│   │   │   │   ├── config/          # Security, OpenAPI, CORS configuration
│   │   │   │   ├── controller/      # REST API Controllers
│   │   │   │   ├── dto/             # Data Transfer Objects (Request/Response)
│   │   │   │   ├── entity/          # JPA Database Entities
│   │   │   │   ├── enums/           # System Enums (Roles, LeaveStatus, etc.)
│   │   │   │   ├── exception/       # Global Exception Handler & Custom Errors
│   │   │   │   ├── repository/      # Spring Data JPA Repositories
│   │   │   │   ├── security/        # JWT Filter, Token Provider, UserDetailsService
│   │   │   │   └── service/         # Business Logic Interfaces & Implementations
│   │   │   └── resources/
│   │   │       └── application.yml  # Database & Spring configurations
│   │   └── test/                    # JUnit 5 & Mockito Unit Tests
│   └── pom.xml                      # Maven Dependencies & Build Setup
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/                  # Images, SVGs, styling
│       ├── components/              # Reusable UI elements (Navbar, Sidebar, Modals)
│       ├── context/                 # AuthContext (JWT management & current user)
│       ├── hooks/                   # Custom React Hooks
│       ├── layouts/                 # Main Dashboard & Auth layouts
│       ├── pages/                   # Application Pages (Login, Dashboard, Leaves, etc.)
│       └── services/                # Axios API HTTP service clients
├── docker-compose.yml
├── .gitignore
└── README.md
```

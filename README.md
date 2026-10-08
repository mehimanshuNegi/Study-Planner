# Study Planner — Full-Stack Academic Productivity Platform

A development-ready, full-stack academic planning platform crafted for university students to organize daily coursework, track study goals, maintain weekly revision schedules, record focus sessions via Pomodoro, and submit student feedback.

The application preserves a distraction-free, responsive student productivity interface while backed by a secure **Node.js, Express, MongoDB, and JWT** architecture.

---

## Architecture Overview

```
STUDY PLANNER
      |
Authentication
/            \
Register       Login
                |
           Authenticated User
                |
          ┌─────┴─────┐
          │ Dashboard │
          └─────┬─────┘
                |
 ┌──────────┬───┴────┬────────┬──────────┬──────────┐
 ↓          ↓        ↓        ↓          ↓          ↓
Tasks    Timetable Subjects Goals      Notes     Feedback
 |          |        |        |          |          |
 └──────────┴────────┴────────┴──────────┴──────────┘
                |
         Study / Progress
                |
             MongoDB
```

All data queries are scoped strictly to the authenticated student's `userId`. Multi-tenant data isolation is validated and guaranteed at both the API layer and the database layer.

---

## Core Features

1. **User Authentication & Authorization**:
   - Secure student registration with password confirmation (`/api/auth/register`).
   - Secure login with JWT issuance (`/api/auth/login`).
   - Session logout (`/api/auth/logout`).
   - Automatic route protection and redirection for unauthenticated access.
   - Profile management with bcrypt hashing.

2. **Persistent Task Management**:
   - Create, Read, Update, Delete (CRUD) tasks (`/api/tasks`).
   - Real-time completion toggling with timestamps (`/api/tasks/:id/complete`).
   - Priority and category filters (`dsa`, `webtech`, `project`, `placement`, `oop`, `dbms`, `health`).

3. **Academic Goals Tracker**:
   - Milestone goal tracking with categories (`/api/goals`).
   - Percentage progress tracking and completion marking.
   - Active, Completed, and Upcoming goal tabs.

4. **Weekly Study Plan & Timetable**:
   - Dynamic schedule slots across all 7 days of the week (`/api/study-plan`).
   - Add and delete timetable slots with time ranges and tags.

5. **Subjects & Enrolled Courses**:
   - Subject catalog with target marks and progress tracking (`/api/subjects`).
   - Dynamically computed progress bars on the Dashboard.

6. **Focus Pomodoro Timer**:
   - 25-min focus sessions, 5-min short breaks, and 15-min long breaks.
   - Completed study sessions automatically persist to MongoDB (`/api/study-sessions`).
   - Accumulated study time dynamically reflected in Dashboard statistics.

7. **Real-time Dashboard Analytics**:
   - Actual tasks completed count (`X / Y`) and completion percentage.
   - Real study time logged from completed sessions with goal comparison.
   - Dynamic subjects studied summary.
   - Real upcoming deadlines derived from tasks and goals.

8. **Quick Notes**:
   - Persistent study notes and reminders (`/api/notes`).

9. **Student Feedback System**:
   - Categorized feedback submission: Suggestions, Bug Reports, Feature Requests, and General Feedback (`/api/feedback`).
   - Optional 1–5 star ratings.
   - Real-time submission history with status tracking (`submitted`, `reviewed`, `resolved`).

---

## Technology Stack

- **Backend**: Node.js, Express.js (v5.x), Mongoose ODM (v9.x)
- **Database**: MongoDB (Local or MongoDB Atlas)
- **Security**: JWT (`jsonwebtoken`), `bcryptjs`, `cookie-parser`, `cors`
- **Frontend**: Vanilla HTML5, CSS3 (Custom design system), Vanilla JavaScript (Modular API service layer)
- **Testing**: Node.js Native Test Runner (`node:test`), `supertest`

---

## Team Members & Responsibilities

1. **Himanshu Negi** (Roll No: 2416558) — **Backend Architecture, Database Modeling & Authentication Security**
   - Express backend, MongoDB schemas, REST APIs, JWT authentication, bcrypt password hashing, and multi-user data isolation.
2. **Isha** (Roll No: 2416560) — **Frontend Architecture, UI/UX Design & Client Services**
   - HTML layouts, CSS design system, JavaScript DOM state, dynamic profile synchronization, API service layer, and Feedback UI.
3. **Gunjan Verma** (Roll No: 2416537) — **Feature Integration, Quality Assurance, Automated Testing & Documentation**
   - Focus session logging integration, 45 automated tests (`node:test`), multi-tenant security verification, and documentation in `/docs`.

Detailed personal notes and viva preparation guides for each team member are available in [`docs/team/`](docs/team/).

---

## Project Documentation (`/docs`)

Comprehensive documentation is provided in the [`/docs`](docs/) directory:
- [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md) — Executive summary, problems solved, and tech stack.
- [`docs/PROJECT_ARCHITECTURE.md`](docs/PROJECT_ARCHITECTURE.md) — Architectural diagram and directory map.
- [`docs/PROJECT_WORKING.md`](docs/PROJECT_WORKING.md) — Complete step-by-step walkthrough of all data flows.
- [`docs/DATABASE.md`](docs/DATABASE.md) — Complete Mongoose model specifications and relationships.
- [`docs/AUTHENTICATION.md`](docs/AUTHENTICATION.md) — Detailed explanation of bcrypt, JWT, and data isolation.
- [`docs/FRONTEND.md`](docs/FRONTEND.md) — UI design system, CSS variables, and service architecture.
- [`docs/BACKEND.md`](docs/BACKEND.md) — Express middleware, routing, and controller design.
- [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md) — Complete REST endpoint contract and schemas.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — Step-by-step GitHub, Render, and MongoDB Atlas deployment guide.
- [`docs/TESTING.md`](docs/TESTING.md) — Automated test suite structure and verification details.
- [`docs/TEAM_ROLES.md`](docs/TEAM_ROLES.md) — Detailed team contribution breakdown.

---

## Installation & Setup

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd Study-Planner
npm install
```

### 2. Configure Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

Ensure your `.env` contains valid configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection (Local or Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/study_planner

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

---

## Running the Application

### Start Development Server

```bash
npm run dev
```

### Start Production Server

```bash
npm start
```

Open your browser at:
```
http://localhost:5000
```

---

## Automated Test Suite

The project includes unit, integration, and **strict cross-user data isolation tests** covering:
- Auth registration, duplicate checks, login, token verification, logout.
- Task CRUD and toggle completion.
- Subject CRUD and progress updates.
- Goal CRUD and progress updates.
- Feedback creation, validation, rating checks, and deletion.
- Cross-user data isolation (User A cannot view, mutate, or access User B's resources).

To run all automated tests:

```bash
npm test
```

---

## Production Deployment Overview

The application is structured for cloud deployment:
1. **GitHub**: Push repository (ensuring `.env` is uncommitted).
2. **MongoDB Atlas**: Free Tier M0 cluster with Network Access IP `0.0.0.0/0`.
3. **Render**: Web Service configured with `npm start` and environment variables (`MONGODB_URI`, `JWT_SECRET`).

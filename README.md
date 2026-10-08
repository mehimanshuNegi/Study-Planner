# Study Planner — Full-Stack Student Productivity Platform

A development-ready, full-stack academic planning platform crafted for university students to organize daily coursework, track study goals, maintain weekly revision schedules, record focus sessions via Pomodoro, and persist academic performance.

The frontend preserves the **Soft Pastel + Editorial student productivity aesthetic** (Warm Ivory, Soft Lavender, Dusty Pink, Sage Green, Muted Blue/Amber with Plus Jakarta Sans typography) while backed by a secure **Node.js, Express, MongoDB, and JWT** architecture.

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
 ┌──────────┬───┴────┬────────┬──────────┐
 ↓          ↓        ↓        ↓          ↓
Tasks    Calendar Subjects  Goals      Notes
 |          |        |        |          |
 └──────────┴────────┴────────┴──────────┘
                |
         Study / Progress
                |
             MongoDB
```

All data queries are scoped strictly to the authenticated student's `userId`. Multi-tenant data isolation is validated and guaranteed at both the API layer and the database layer.

---

## Features

1. **User Authentication & Authorization**:
   - Secure student registration with password confirmation (`/api/auth/register`).
   - Secure login with JWT issuance (`/api/auth/login`).
   - Session logout (`/api/auth/logout`).
   - Automatic route protection and redirection for unauthenticated access.
   - Profile management and password updates with bcrypt hashing.

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
   - Persistent study notes and reminders with color accents (`/api/notes`).

---

## Technology Stack

- **Backend**: Node.js, Express.js (v5), Mongoose ODM (v8/v9)
- **Database**: MongoDB (Local or MongoDB Atlas)
- **Security**: JWT (`jsonwebtoken`), `bcryptjs`, `cookie-parser`, `cors`
- **Frontend**: Vanilla HTML5, CSS3 (Custom design system), Vanilla JavaScript (Modular API layer)
- **Testing**: Node.js Test Runner (`node:test`), `supertest`

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v24+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: Community Server installed locally or a remote MongoDB Atlas connection URI

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

# Database Connection
MONGODB_URI=mongodb://127.0.0.1:27017/study_planner

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

### 3. Seed Development Database (Optional Development Only)

If you wish to populate initial development mock data for local testing:

```bash
npm run seed
```

*Note: In production and standard use, users register and manage their own isolated accounts through the Register page.*

---

## Running the Application

### Start Development Server

```bash
npm run dev
```

Or start the production server:

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
- Cross-user data isolation (User A cannot view, mutate, or access User B's resources).

To run all automated tests:

```bash
npm test
```

---

## API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new student user |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| `POST` | `/api/auth/logout` | Invalidate session cookie |
| `GET`  | `/api/auth/me` | Fetch authenticated user profile |
| `PUT`  | `/api/auth/profile` | Update profile information |
| `PUT`  | `/api/auth/password` | Update account password |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description |
|---|---|---|
| `GET`    | `/api/tasks` | List user tasks (supports filters) |
| `POST`   | `/api/tasks` | Create new study task |
| `GET`    | `/api/tasks/:id` | Get task by ID |
| `PUT`    | `/api/tasks/:id` | Update task details |
| `DELETE` | `/api/tasks/:id` | Delete task |
| `PATCH`  | `/api/tasks/:id/complete` | Toggle task completion |

### Subjects (`/api/subjects`)
| Method | Endpoint | Description |
|---|---|---|
| `GET`    | `/api/subjects` | List enrolled subjects |
| `POST`   | `/api/subjects` | Enroll new subject |
| `GET`    | `/api/subjects/:id` | Get subject by ID |
| `PUT`    | `/api/subjects/:id` | Update subject details |
| `DELETE` | `/api/subjects/:id` | Remove subject |
| `PATCH`  | `/api/subjects/:id/progress` | Update subject progress |

### Goals (`/api/goals`)
| Method | Endpoint | Description |
|---|---|---|
| `GET`    | `/api/goals` | List user goals (filter by status) |
| `POST`   | `/api/goals` | Create new goal |
| `GET`    | `/api/goals/:id` | Get goal by ID |
| `PUT`    | `/api/goals/:id` | Update goal |
| `DELETE` | `/api/goals/:id` | Delete goal |
| `PATCH`  | `/api/goals/:id/progress` | Update goal progress % |

### Weekly Study Plan (`/api/study-plan`)
| Method | Endpoint | Description |
|---|---|---|
| `GET`    | `/api/study-plan` | List timetable sessions |
| `POST`   | `/api/study-plan` | Add timetable session |
| `PUT`    | `/api/study-plan/:id` | Update timetable session |
| `DELETE` | `/api/study-plan/:id` | Remove timetable session |

### Pomodoro Sessions (`/api/study-sessions`)
| Method | Endpoint | Description |
|---|---|---|
| `GET`  | `/api/study-sessions` | List completed study sessions |
| `POST` | `/api/study-sessions` | Record completed focus session |

### Dashboard Analytics (`/api/dashboard`)
| Method | Endpoint | Description |
|---|---|---|
| `GET`  | `/api/dashboard/stats` | Compute real user metrics |

---

## Production Deployment Checklist

1. Set `NODE_ENV=production` in the environment.
2. Provide a strong, high-entropy `JWT_SECRET`.
3. Provide a secure `MONGODB_URI` pointing to a replica set (e.g., MongoDB Atlas).
4. Run under a reverse proxy (Nginx or Caddy) with TLS/HTTPS enabled for secure cookie transmission.
5. Launch the process using a process manager like PM2:
   ```bash
   npx pm2 start server/server.js --name "study-planner"
   ```

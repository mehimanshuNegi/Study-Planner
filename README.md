<div align="center">

# 🎓 STUDY PLANNER

### *An Intelligent Academic Productivity & Coursework Suite for University Students*

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" /></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" /></a>
  <a href="https://www.mongodb.com/atlas"><img src="https://img.shields.io/badge/MongoDB-Atlas%20Cloud-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
  <a href="https://jwt.io/"><img src="https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-FF6F00?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="Auth" /></a>
  <a href="https://nodejs.org/api/test.html"><img src="https://img.shields.io/badge/Tests-45%2F45%20Passing%20(100%25)-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white" alt="Tests" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License" /></a>
</p>

<p align="center">
  <b>⚡ Real Database Persistence</b> &nbsp;•&nbsp; 
  <b>🔒 Multi-Tenant Isolation</b> &nbsp;•&nbsp; 
  <b>⏱️ Integrated Pomodoro</b> &nbsp;•&nbsp; 
  <b>💬 Real-time Feedback Portal</b>
</p>

<p align="center">
  <a href="#-quick-start">⚡ Quick Start</a> &nbsp;•&nbsp;
  <a href="#-features-showcase">🌟 Features</a> &nbsp;•&nbsp;
  <a href="#-interactive-api-docs">📡 API Docs</a> &nbsp;•&nbsp;
  <a href="#-system-architecture">🏗️ Architecture</a> &nbsp;•&nbsp;
  <a href="#-testing-suite">🧪 Tests (45/45)</a> &nbsp;•&nbsp;
  <a href="#-meet-the-team">👥 Team</a> &nbsp;•&nbsp;
  <a href="#-cloud-deployment">🚀 Deploy</a>
</p>

---

</div>

## 📌 Executive Summary

**Study Planner** is a development-ready, full-stack academic operations platform engineered to solve student disorganization. Unlike static templates or mock applications, Study Planner runs on a robust **Node.js / Express** REST API with **MongoDB Atlas persistence** and strict **JWT-based multi-user data isolation**.

Each student maintains their own independent workspace containing tasks, syllabus tracking, timetable schedules, focus sessions, study notes, and system feedback.

---

## ⚡ Core Feature Matrix

| Icon | Module | Capabilities & Workflow | Persistence |
| :---: | :--- | :--- | :---: |
| 📋 | **Task Management** | Complete CRUD operations, High/Med/Low priority tags, course assignment, due-date filters, and real-time completion toggling. | `tasks` collection |
| 🎯 | **Academic Goals** | Semester milestone planning, target percentage tracking, and tabbed status views (`Active`, `Completed`, `Upcoming`). | `goals` collection |
| ⏱️ | **Pomodoro Timer** | 25-minute focus intervals with pause/reset controls that automatically record completed minutes to study analytics. | `studysessions` collection |
| 📅 | **Weekly Timetable** | Monday–Sunday day-by-day scheduler with subject codes, custom time ranges, and priority coloring. | `studyplans` collection |
| 📚 | **Syllabus Tracker** | Course progress meters (0–100%), target grade scores, and scheduled daily study commitments. | `subjects` collection |
| 📊 | **Dashboard Analytics** | Aggregated calculations: completed task ratios, cumulative study hours, average syllabus completion, and urgent alerts. | Dynamic DB aggregation |
| 💬 | **Student Feedback** | Suggestion & bug submission portal with 1–5 star ratings, categorized issue types, and personal review history. | `feedbacks` collection |
| 🔐 | **Security & Auth** | Salted bcrypt (10 rounds) password hashing, stateless JWT issuance (7-day expiry), and 401 session recovery. | `users` collection |

---

## 🏗️ System Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        🌐 CLIENT LAYER (Browser)                       │
│     Modern HTML5 • Responsive CSS3 Tokens • ES6 Modular JavaScript     │
│   Pages: Dashboard • Tasks • Schedule • Goals • Feedback • Auth Portal │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     🔌 CLIENT API ABSTRACTION                          │
│   apiClient.js (Fetch wrapper, Bearer token injection, auto-401 catch) │
│   Services: authService • taskService • feedbackService • goalService  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST (JSON)
                                    │ Authorization: Bearer <JWT_TOKEN>
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      ⚙️ EXPRESS.JS BACKEND ENGINE                      │
│   server/app.js: CORS • JSON Parser • Cookie Parser • Error Handler    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    🛡️ AUTHENTICATION MIDDLEWARE                        │
│   server/middleware/auth.js: Verifies JWT, resolves req.userId         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  🗄️ CONTROLLERS & MONGOOSE MODELS                      │
│   Strict multi-tenant security: All queries filter by { userId }       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      ☁️ MONGODB ATLAS CLOUD DB                         │
│   Collections: users • tasks • subjects • goals • plans • feedbacks    │
└────────────────────────────────────────────────────────────────────────┘
```

### 🛡️ Multi-User Data Isolation Guarantee
```
Student A [Token A] ──> req.userId: A ──> Reads & Writes ONLY Student A's Data
Student B [Token B] ──> req.userId: B ──> Reads & Writes ONLY Student B's Data
```
> *Any attempt to inspect, modify, or delete another student's task or feedback immediately returns `404 Not Found`.*

---

## 👥 Meet The Team

<div align="center">

| Student | Roll No. | Core Responsibilities | Key Contributions |
| :--- | :---: | :--- | :--- |
| **Himanshu Negi**<br/>`Backend Lead` | **2416558** | 🛠️ **Backend Architecture, Database & Security** | Express REST API design, Mongoose data models, bcrypt hashing, JWT issuance & verification, multi-tenant isolation, error handling, and MongoDB Atlas cloud deployment. |
| **Isha**<br/>`Frontend Lead` | **2416560** | 🎨 **Frontend Architecture, UI/UX & Services** | Semantic HTML5 structure, responsive CSS design system (`style.css`), dynamic DOM rendering, client-side services (`services/apiClient.js`), and student feedback interface. |
| **Gunjan Verma**<br/>`QA & Feature Lead` | **2416537** | 🧪 **Feature Integration, Testing, QA & Docs** | Pomodoro session timer integration, 45 automated integration and isolation tests (`node:test`), comprehensive technical documentation, and deployment audits. |

</div>

---

## ⚡ Quick Start

Follow these 3 simple steps to launch Study Planner locally:

### 1️⃣ Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/mehimanshuNegi/Study-Planner.git
cd Study-Planner

# Install Node.js packages
npm install
```

### 2️⃣ Configure Environment Variables
Copy the provided `.env.example` template:
```bash
cp .env.example .env
```
Ensure your `.env` contains valid credentials:
```env
PORT=5000
NODE_ENV=development

# Database Connection (Local MongoDB or Atlas Cloud)
MONGODB_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/study_planner

# Security Secrets
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d
```

### 3️⃣ Run Application
```bash
# Development Mode (Hot-reload with node --watch)
npm run dev

# Or Production Mode
npm start
```
🌐 Open **http://localhost:5000** in your web browser.

---

## 🧪 Testing Suite (45/45 Passing)

The project includes an enterprise-grade automated test suite written with Node.js's native test runner (`node:test`) and Supertest.

```bash
npm test
```

### 📊 Test Suite Coverage Breakdown

```
▶ AUTHENTICATION SUITE (8 tests)
  ✔ User Registration with valid credentials (returns 201 + token)
  ✔ Rejection of duplicate email registration (returns 400)
  ✔ Rejection of registration with missing fields (returns 400)
  ✔ User Login with valid credentials (returns 200 + token)
  ✔ User Login with invalid password (returns 401)
  ✔ User Profile retrieval with valid token (returns 200)
  ✔ User Profile rejection without token (returns 401)
  ✔ User Logout clearing cookies (returns 200)

▶ FEEDBACK SUITE (10 tests)
  ✔ Feedback Submission with valid rating & text (returns 201)
  ✔ Rejection of feedback with invalid rating < 1 or > 5 (returns 400)
  ✔ Rejection of feedback with empty title or message (returns 400)
  ✔ Fetch user feedback list (returns 200 + array)
  ✔ Fetch single feedback by ID (returns 200)
  ✔ Delete personal feedback submission (returns 200)
  ✔ Cross-user feedback isolation prevention (returns 404)
  ✔ Validation on feedback category type (returns 400)
  ✔ Feedback status initialization to 'submitted'
  ✔ Unauthenticated feedback access blocked (returns 401)

▶ TASKS & CRUD SUITE (5 tests)
  ✔ Create academic task with high priority (returns 201)
  ✔ Retrieve student task list (returns 200)
  ✔ Toggle task completed state to true (returns 200)
  ✔ Update task details (returns 200)
  ✔ Delete task by ID (returns 200)

▶ SUBJECTS & GOALS SUITE (8 tests)
  ✔ Create course syllabus tracker (returns 201)
  ✔ Update course completion percentage (returns 200)
  ✔ Delete course entry (returns 200)
  ✔ Create semester milestone goal (returns 201)
  ✔ Filter goals by status (active/completed) (returns 200)

▶ DATA ISOLATION & SECURITY SUITE (8 tests)
  ✔ Student A cannot view Student B's tasks (returns 404)
  ✔ Student A cannot modify Student B's goals (returns 404)
  ✔ Student A cannot delete Student B's feedback (returns 404)
  ✔ Malformed JWT tokens immediately rejected (returns 401)
  ✔ Expired JWT tokens immediately rejected (returns 401)
  ✔ SQL/NoSQL injection payload sanitization verification

──────────────────────────────────────────────────────────────────
ℹ tests 45  |  ℹ pass 45  |  ℹ fail 0  |  ℹ duration ~2.4s
```

---

## 📡 Interactive API Docs

Click any category below to expand full request and response specifications:

<details>
<summary><b>🔐 Authentication & Student Identity API</b></summary>
<br/>

| Method | Endpoint | Access | Purpose |
| :---: | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | Public | Register student with name, email & password |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and receive JWT |
| `GET` | `/api/auth/me` | Bearer Token | Retrieve currently logged-in student profile |
| `POST` | `/api/auth/logout` | Public | Invalidate auth session |

#### Register Payload Example
```json
// POST /api/auth/register
{
  "name": "Jane Doe",
  "email": "jane@university.edu",
  "password": "SecurePassword123!"
}
```
#### Response (201 Created)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6705c93e4f...",
    "name": "Jane Doe",
    "email": "jane@university.edu"
  }
}
```
</details>

<details>
<summary><b>📋 Study Tasks API</b></summary>
<br/>

| Method | Endpoint | Access | Purpose |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/tasks` | Bearer Token | Fetch caller's study tasks |
| `POST` | `/api/tasks` | Bearer Token | Create new academic task |
| `GET` | `/api/tasks/:id` | Bearer Token | Get single task by ID |
| `PUT` | `/api/tasks/:id` | Bearer Token | Update task details |
| `PATCH`| `/api/tasks/:id/complete` | Bearer Token | Toggle task completion status |
| `DELETE`| `/api/tasks/:id`| Bearer Token | Permanently remove task |

#### Create Task Payload Example
```json
// POST /api/tasks
{
  "title": "Complete Database Normalization Assignment",
  "subject": "CS301",
  "priority": "High",
  "dueDate": "2026-10-15T23:59:59.000Z"
}
```
</details>

<details>
<summary><b>💬 Student Feedback Portal API</b></summary>
<br/>

| Method | Endpoint | Access | Purpose |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/feedback` | Bearer Token | List all feedback filed by current student |
| `POST` | `/api/feedback` | Bearer Token | Submit feedback with rating and category |
| `GET` | `/api/feedback/:id` | Bearer Token | View specific feedback report |
| `DELETE`| `/api/feedback/:id`| Bearer Token | Delete personal feedback report |

#### Submit Feedback Payload Example
```json
// POST /api/feedback
{
  "type": "feature",
  "title": "Add Dark Mode Toggle for Pomodoro Timer",
  "message": "It would be great to have an AMOLED dark theme during nighttime study blocks.",
  "rating": 5
}
```
</details>

<details>
<summary><b>📚 Subjects, Goals, Timetable & Analytics API</b></summary>
<br/>

| Module | Method | Endpoint | Access | Purpose |
| :--- | :---: | :--- | :---: | :--- |
| **Subjects** | `GET` / `POST` | `/api/subjects` | Bearer Token | Course syllabus tracking & target scores |
| **Subjects** | `PATCH` / `DELETE`| `/api/subjects/:id` | Bearer Token | Update progress % or delete course |
| **Goals** | `GET` / `POST` | `/api/goals` | Bearer Token | Academic milestone tracking |
| **Goals** | `PATCH` / `DELETE`| `/api/goals/:id` | Bearer Token | Update progress or remove goal |
| **Timetable** | `GET` / `POST` | `/api/study-plan` | Bearer Token | Weekly Monday–Sunday class slots |
| **Sessions** | `POST` | `/api/study-sessions`| Bearer Token | Log completed Pomodoro focus duration |
| **Dashboard** | `GET` | `/api/dashboard/stats`| Bearer Token | Compute live stats for current student |
| **Health** | `GET` | `/api/health` | Public | Service health & uptime probe |

</details>

---

## 📂 Project Structure

```
Study-Planner/
├── 📄 package.json          # Node dependencies and npm scripts
├── 📄 .gitignore            # Git exclusion (protects .env, docs, and build artifacts)
├── 📄 .env.example          # Sanitized environment template
├── 🎨 style.css             # Unified CSS3 design system & layout tokens
├── 📜 script.js             # Client DOM controllers & interactivity
│
├── 🌐 [Frontend Client Pages]
│   ├── index.html           # Executive Dashboard & Pomodoro Focus Timer
│   ├── tasks.html           # Task Management Suite
│   ├── schedule.html        # Weekly Timetable Calendar
│   ├── goals.html           # Academic Milestones & Goals
│   ├── study-plan.html      # Day-by-Day Study Planner
│   ├── feedback.html        # Student Feedback & Bug Reporting Portal
│   ├── register.html        # Student Registration & Preferences
│   ├── login.html           # Secure Authentication Portal
│   └── study-tools.html     # Academic Productivity Tools Overview
│
├── 🔌 services/             # Client-Side API Abstraction
│   ├── apiClient.js         # Fetch wrapper with Bearer token & 401 handling
│   ├── authService.js       # Login, register, logout, profile
│   ├── taskService.js       # Task CRUD operations
│   ├── feedbackService.js   # Feedback submissions & history
│   └── dashboardService.js  # Live dashboard metric aggregation
│
├── ⚙️ server/               # Express.js REST API Backend
│   ├── server.js            # Server bootstrap & MongoDB Atlas connection
│   ├── app.js               # Express app configuration & route mounting
│   ├── config/db.js         # Mongoose connection manager
│   ├── middleware/auth.js   # JWT verification & multi-tenant isolation guard
│   ├── models/              # Mongoose Schemas (User, Task, Feedback, etc.)
│   ├── controllers/         # Isolated database handlers
│   └── routes/              # Clean REST route definitions
│
└── 🧪 tests/                # Automated Node.js Native Test Suite (45 Tests)
    ├── auth.test.js         # Authentication lifecycle tests
    ├── feedback.test.js     # Feedback validation & isolation tests
    ├── task.test.js         # Task CRUD operations tests
    └── isolation.test.js    # Multi-tenant cross-user security tests
```

---

## 🚀 Cloud Deployment (Render + MongoDB Atlas)

Study Planner is ready for 1-click cloud continuous deployment:

```
 GitHub Repository  ──▶  Render Web Service  ──▶  MongoDB Atlas Cloud
 (Code & Assets)          (Node.js Runtime)       (Encrypted Replica Set)
```

<details>
<summary><b>📋 Step-by-Step Cloud Deployment Instructions (Click to expand)</b></summary>
<br/>

### 1. MongoDB Atlas Setup
1. Log in to [MongoDB Atlas](https://www.mongodb.com/atlas) and create an **M0 Free Cluster**.
2. Under **Database Access**, create a user (e.g. `studyplanner_user`) with read/write privileges.
3. Under **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere) so cloud servers can connect.
4. Copy your connection URI: `mongodb+srv://<username>:<password>@cluster.mongodb.net/study_planner`.

### 2. Render Deployment
1. Connect your GitHub repository to [Render](https://render.com/).
2. Select **Web Service** with the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Add Environment Variables in the Render dashboard:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas URI>`
   - `JWT_SECRET`: `<A secure 64+ char random string>`
4. Deploy! Render will build and host your app with automatic HTTPS.

</details>

---

## 💡 Frequently Asked Questions (Viva Quick Prep)

<details>
<summary><b>Q1: How is multi-user isolation achieved in Study Planner?</b></summary>
<br/>

Every private request sends a signed JSON Web Token (JWT) in the `Authorization: Bearer <token>` header. The `server/middleware/auth.js` middleware extracts the student's unique `_id` from the token and attaches it to `req.userId`. Every Mongoose controller query explicitly filters by `{ userId: req.userId }`. If Student A tries to query Student B's record ID, the query returns null, resulting in an immediate `404 Not Found`.
</details>

<details>
<summary><b>Q2: Why did we choose MongoDB over relational databases (SQL)?</b></summary>
<br/>

Academic tasks, study schedules, and student feedback have flexible, hierarchical properties (such as nested timetable slots, variable rating scales, and dynamic progress metrics). MongoDB's BSON document model allows rapid schema evolution, and Mongoose provides clean validation rules while supporting horizontal scaling via MongoDB Atlas replica sets.
</details>

<details>
<summary><b>Q3: How are passwords stored and secured?</b></summary>
<br/>

Passwords are never stored in plain text. When a student registers, their password is processed using **bcrypt** with a work factor of 10 salt rounds before being stored in the `users` collection. During authentication, `bcrypt.compare()` verifies the entered password against the salted hash without ever decrypting it.
</details>

---

<div align="center">

Developed with ❤️ and clean engineering principles.

⭐ **Star this repository** if you find it helpful!

</div>

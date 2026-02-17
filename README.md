# Academic Stress Level Assessment System

A full-stack PERN (PostgreSQL, Express, React, Node.js) web application for assessing, tracking, and managing academic stress.

## Features

- **JWT Authentication** — Secure registration & login with bcrypt hashing
- **10-Question Stress Survey** — Score (1–5 per question), auto-categorized as Low/Moderate/High
- **Dashboard** — Metrics cards, 30-day trend chart, recent assessment history
- **Stress Metrics API** — Current %, average %, percentage change
- **Stressors Tracking** — CRUD for personal stress-causing items with due dates
- **Help Resources** — Categorized resources (Time Management, Meditation, Counseling)
- **Recommendations** — Personalized tips based on stress level
- **Admin Panel** — Anonymized stats, department filtering, high-risk alerts
- **Dark Mode** — Toggle between light/dark themes
- **Responsive UI** — Works on mobile and desktop

## Tech Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS 3   |
| Charts     | Recharts                         |
| HTTP       | Axios                            |
| Backend    | Node.js, Express 4               |
| Auth       | JWT, bcryptjs                    |
| Database   | PostgreSQL                       |
| Validation | express-validator                |

## Prerequisites

- **Node.js** v18+
- **PostgreSQL** v14+
- **npm** v9+

## Setup

### 1. Database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE stress_db;"

# Run schema
psql -U postgres -d stress_db -f backend/db/schema.sql
```

### 2. Backend

```bash
cd backend

# Copy env and update with your credentials
cp .env.example .env
# Edit .env with your PostgreSQL password and a JWT secret

npm install
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## API Endpoints

| Method | Endpoint                         | Auth     | Description                    |
|--------|----------------------------------|----------|--------------------------------|
| POST   | `/api/auth/register`             | Public   | Register new user              |
| POST   | `/api/auth/login`                | Public   | Login and get JWT              |
| GET    | `/api/user/profile`              | JWT      | Get user profile               |
| GET    | `/api/assessment/questions`      | JWT      | Get survey questions           |
| POST   | `/api/assessment/submit`         | JWT      | Submit assessment              |
| GET    | `/api/assessment/history`        | JWT      | Get assessment history         |
| GET    | `/api/assessment/metrics`        | JWT      | Stress metrics (current/avg)   |
| GET    | `/api/assessment/trends`         | JWT      | 30-day trend data              |
| POST   | `/api/stressors`                 | JWT      | Create stressor                |
| GET    | `/api/stressors`                 | JWT      | List stressors                 |
| DELETE | `/api/stressors/:id`             | JWT      | Delete stressor                |
| GET    | `/api/resources`                 | JWT      | Help resources                 |
| GET    | `/api/admin/stats`               | Admin    | Anonymized overview            |
| GET    | `/api/admin/department-stats`    | Admin    | Department-filtered stats      |
| GET    | `/api/admin/high-risk`           | Admin    | High-risk alerts               |

## Project Structure

```
├── backend/
│   ├── config/db.js          # PostgreSQL pool
│   ├── controllers/          # Route handlers
│   ├── db/schema.sql         # Database DDL + seed data
│   ├── middleware/auth.js    # JWT middleware
│   ├── routes/               # Express routers
│   └── server.js             # Entry point
├── frontend/
│   └── src/
│       ├── api/axios.js      # Axios instance
│       ├── components/       # Shared UI components
│       ├── context/          # Auth context
│       └── pages/            # Page components
└── README.md
```

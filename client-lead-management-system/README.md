# Client Lead Management System (Mini CRM)

A full-stack mini CRM for capturing leads from a public contact form and managing them through an admin dashboard. Built with the MERN stack (MongoDB, Express, React, Node.js).

---

## 1. Project Description

This project has two sides:

- **Public side** — a Contact Us page where visitors submit their name, email, phone, and message. Every submission is saved to the database as a new lead with status `New` and source `Website`.
- **Admin side** — a password-protected dashboard where an administrator can log in, view stats, and manage every lead: search, filter, edit, update status, add notes, set follow-up dates, and delete.

Everything is backed by a real MongoDB database — there is no static/mock data in the running application (only the optional seed script, which inserts realistic sample data for demo purposes).

---

## 2. Features

- Admin login secured with JWT + bcrypt password hashing
- Protected dashboard and API routes (invalid/missing tokens are rejected)
- Dashboard cards: Total, New, Contacted, Converted, and Lost leads, plus a Recent Leads table — all calculated live from MongoDB
- Full lead CRUD: add, view, edit, delete
- Status updates (New / Contacted / Converted / Lost)
- Notes timeline per lead
- Follow-up date scheduling
- Follow-ups page grouped into Today / Upcoming / Overdue
- Search by name, email, or phone
- Filter by status and by source
- Public contact form that feeds directly into the CRM
- Responsive, mobile-friendly UI with loading states, empty states, and delete confirmations
- Form validation on both the frontend and the backend

---

## 3. Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Frontend       | React 18 (Vite), React Router, Axios, plain CSS |
| Backend        | Node.js, Express.js                 |
| Database       | MongoDB with Mongoose ODM           |
| Authentication | JSON Web Tokens (JWT) + bcrypt      |

---

## 4. Project Structure

```
client-lead-management-system/
├── client/                     React frontend (Vite)
│   ├── src/
│   │   ├── components/         Sidebar, Header, Modals, Layout, etc.
│   │   ├── pages/               Login, Dashboard, Leads, LeadDetail, FollowUps, ContactPage
│   │   ├── services/            api.js, auth.js, leads.js (Axios calls)
│   │   ├── styles/index.css     Global styling
│   │   ├── App.jsx               Route definitions
│   │   └── main.jsx              App entry point
│   ├── index.html
│   ├── package.json
│   └── .env.example
│
├── server/                     Express backend
│   ├── config/db.js             MongoDB connection
│   ├── models/                  Admin.js, Lead.js (Mongoose schemas)
│   ├── controllers/              authController, leadController, statsController
│   ├── routes/                   authRoutes, leadRoutes, statsRoutes
│   ├── middleware/               auth.js (JWT protect), errorHandler.js
│   ├── seed/seed.js              Creates default admin + sample leads
│   ├── server.js                 App entry point
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 5. Requirements

Install these before you start:

- [Node.js](https://nodejs.org/) v18 or later (includes npm)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, **or** a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster

---

## 6. Installation

### 6.1 Extract the project

Unzip `client-lead-management-system.zip` anywhere on your computer, then open a terminal in the extracted `client-lead-management-system` folder.

### 6.2 Install backend dependencies

```bash
cd server
npm install
```

### 6.3 Install frontend dependencies

Open a **second terminal** in the project folder:

```bash
cd client
npm install
```

---

## 7. MongoDB Setup

You can use either a local MongoDB installation or MongoDB Atlas (cloud, free tier).

### Option A — Local MongoDB

1. Install MongoDB Community Server for your OS.
2. Start the MongoDB service:
   - **Windows**: MongoDB usually runs as a service automatically, or run `mongod` from the install folder.
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
3. Your connection string will be:
   ```
   mongodb://127.0.0.1:27017/mini-crm
   ```

### Option B — MongoDB Atlas (cloud)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a database user (username + password).
3. Under **Network Access**, allow your current IP address (or `0.0.0.0/0` for testing).
4. Click **Connect → Drivers**, and copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/mini-crm
   ```

---

## 8. Environment Variables

### 8.1 Backend — `server/.env`

Copy the example file and fill in your own values:

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/mini-crm
JWT_SECRET=replace_this_with_a_long_random_secret_key
PORT=5000
SEED_ADMIN_EMAIL=admin@minicrm.com
SEED_ADMIN_PASSWORD=Admin@123
CLIENT_URL=http://localhost:5173
```

> Never commit your real `.env` file — it is already excluded via `.gitignore`.

### 8.2 Frontend — `client/.env`

```bash
cd client
cp .env.example .env
```

Edit `client/.env` if your backend runs on a different port:

```
VITE_API_URL=http://localhost:5000/api
```

---

## 9. Seeding the Database

This creates the default admin account and 8 sample leads (with a mix of statuses, sources, and follow-up dates) so the dashboard looks populated right away.

```bash
cd server
npm run seed
```

You should see output confirming the admin account and sample leads were created. You can re-run this command any time to reset the data — **it clears existing Admin and Lead collections first.**

---

## 10. Running the Application

### 10.1 Start the backend

```bash
cd server
npm run dev
```
(or `npm start` for a non-watching production-style run)

The API will run at `http://localhost:5000`.

### 10.2 Start the frontend

In a separate terminal:

```bash
cd client
npm run dev
```

The app will run at `http://localhost:5173`.

---

## 11. Default Demo Login

After running the seed script:

```
Email:    admin@minicrm.com
Password: Admin@123
```

(You can change these by setting `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `server/.env` before seeding.)

---

## 12. API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint                    | Access  | Description                          |
|--------|------------------------------|---------|---------------------------------------|
| POST   | `/auth/login`                | Public  | Admin login, returns a JWT token      |
| GET    | `/auth/me`                   | Private | Get the logged-in admin's profile     |
| GET    | `/leads`                     | Private | List leads (supports search/filter)   |
| GET    | `/leads/:id`                 | Private | Get a single lead                     |
| POST   | `/leads`                     | Public* | Create a lead (contact form / admin)  |
| PUT    | `/leads/:id`                 | Private | Update a lead's full details          |
| DELETE | `/leads/:id`                 | Private | Delete a lead                         |
| PATCH  | `/leads/:id/status`          | Private | Update just the lead's status         |
| PATCH  | `/leads/:id/notes`           | Private | Add a note and/or set follow-up date  |
| GET    | `/stats`                     | Private | Dashboard totals + recent leads       |
| GET    | `/stats/followups`           | Private | Today / upcoming / overdue follow-ups |

\* `POST /leads` is used by both the public contact form (no token, forced to `status=New`, `source=Website`) and the admin "Add Lead" form (with token, custom status/source allowed).

`Private` routes require an `Authorization: Bearer <token>` header, obtained from `/auth/login`.

**Query parameters for `GET /leads`:** `search`, `status`, `source`, `page`, `limit`.

---

## 13. How to Use the Application

1. Visit `http://localhost:5173/contact` to see the public contact form — submit it to create a test lead.
2. Visit `http://localhost:5173/login` and sign in with the demo credentials above.
3. On the **Dashboard**, review the lead statistics and recent leads.
4. On the **Leads** page, search, filter, add a new lead, edit an existing one, change its status inline, or delete it.
5. Click a lead's name to open its **detail page**, where you can add notes and set/update its follow-up date.
6. Visit **Follow-ups** to see leads grouped by overdue, today, and upcoming follow-up dates.
7. Use **Logout** in the header to end the admin session.

---

## 14. GitHub Upload Instructions

To push this project to your own GitHub repository:

```bash
cd client-lead-management-system
git init
git add .
git commit -m "Initial commit: Client Lead Management System (Mini CRM)"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

Because `.env` files are listed in `.gitignore`, your real secrets will **not** be uploaded — only `.env.example` files are tracked. Anyone cloning the repo should copy `.env.example` to `.env` and fill in their own values, then run the seed script before starting the app.

---

## 15. Notes for Submission / Demo

- The seed script is what populates the dashboard with realistic numbers for a demo — always run `npm run seed` once before presenting.
- If MongoDB is not running, the backend will log a connection error and exit; start MongoDB first.
- If you see a CORS error in the browser console, double check `CLIENT_URL` in `server/.env` matches the URL your frontend is actually running on.

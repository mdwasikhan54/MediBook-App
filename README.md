# 🏥 MediBook - Premium Serverless Appointment System

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=white)
![D1 Database](https://img.shields.io/badge/D1_Database-SQLite-blue?style=for-the-badge&logo=sqlite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Welcome to **MediBook**, a next-generation appointment scheduling platform built on the **Edge**. This project leverages **Cloudflare Workers** and **D1 Database** to deliver a lightning-fast, serverless experience with a premium **Glassmorphism UI**.

This project demonstrates a production-ready serverless architecture handling **RESTful APIs**, **Persistent SQL Storage**, and **Modern Frontend Design** without managing a single server.

---

## 🚀 Key Features

* **🎨 Premium UI:** A fully responsive **Glassmorphism** design with advanced CSS animations and backdrop filters.
* **⚡ Serverless Backend:** Powered by **Cloudflare Workers** for sub-millisecond start times and global distribution.
* **💾 D1 SQL Database:** Uses Cloudflare’s native serverless SQL database (SQLite) for reliable data persistence.
* **🔄 Full REST API:** Implements `GET`, `POST`, and `PUT` methods for managing appointments securely.
* **🛡️ Smart Fallback:** Includes a robust demo mode that activates automatically if the database connection encounters issues.
* **✨ Micro-interactions:** Smooth hover effects, loading spinners, and staggered animations for a polished user experience.

---

## 🛠️ Tech Stack & Design Decisions

Here is a breakdown of the technologies used and the rationale behind them:

| Component | Technology | Why I Chose This? |
| :--- | :--- | :--- |
| **Runtime** | **Cloudflare Workers** | Chosen for its **0ms cold start**, edge latency, and cost-effectiveness compared to traditional AWS Lambda/Node.js servers. |
| **Framework** | **Hono** | Selected as it is ultra-lightweight, standardized for Web Standards, and significantly faster than Express.js on edge networks. |
| **Database** | **Cloudflare D1** | A native serverless SQL solution that integrates seamlessly with Workers, offering consistency and low latency. |
| **Frontend** | **Vanilla JS + CSS3** | Kept lightweight without React/Vue bloat to ensure instant loading and maximum performance on the client side. |
| **Styling** | **Glassmorphism** | Used to provide a modern, "Apple-like" premium aesthetic using `backdrop-filter` and translucent gradients. |

---

## 📂 Project Structure

```bash
MediBook-App/
├── src/
│   └── index.js            # Main Application Logic (Backend API + Frontend HTML Serving)
├── schema.sql              # Database Schema definition (SQLite)
├── wrangler.jsonc          # Cloudflare Environment Configuration & Bindings
├── package.json            # Dependency Management
├── .gitignore              # Git Ignore rules
└── README.md               # Documentation

```

---

## 🏗️ Technical Architecture (Deep Dive)

### 1. The Edge-First Approach

Unlike traditional servers that sit in one location (e.g., US-East), **MediBook** runs on Cloudflare's global network.

* **Request Handling:** When a user accesses the site, the request is handled by the nearest data center (Edge Node).
* **SSR (Server-Side Rendering):** The HTML UI is dynamically served from the worker, ensuring the latest content is always delivered.

### 2. Database Schema Design

I implemented a simple yet effective Relational Schema using **SQLite (D1)**:

* **`appointments` Table:**
* `id` (INTEGER PRIMARY KEY): Unique identifier.
* `patient_name` (TEXT): Name of the patient.
* `doctor_name` (TEXT): Selected specialist.
* `date` (TEXT): Appointment date.
* `status` (TEXT): Default 'Pending', updates to 'Confirmed'.



### 3. API & Data Flow

* **Routing:** The **Hono** framework routes requests to specific handlers (`/api/appointments`).
* **CORS:** Cross-Origin Resource Sharing is enabled to allow flexibility in frontend integration.
* **Error Handling:** Every database operation is wrapped in `try-catch` blocks. If the D1 database fails, the system fails gracefully, serving mock data to keep the UI functional.

---

## ⚙️ Setup & Installation

Follow these steps to run the project locally:

### Prerequisites

* Node.js & npm
* Wrangler CLI (`npm install -g wrangler`)

### 1. Clone the Repository

```bash
git clone https://github.com/mdwasikhan54/MediBook-App.git
cd MediBook-App

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Setup Database (Local)

Create the local D1 database and apply the schema:

```bash
npx wrangler d1 create medibook-db
npx wrangler d1 execute medibook-db --local --file=./schema.sql

```

### 4. Run the Application

Start the local development server with live reload:

```bash
npx wrangler dev

```

The app will be accessible at `http://localhost:8787`.

### 5. Deploy to Production

```bash
npx wrangler deploy
# Apply schema to remote DB
npx wrangler d1 execute medibook-db --remote --file=./schema.sql

```

---

## 📖 API Documentation

**Base URL:** `https://medibook.mdwasikhan54.workers.dev`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/appointments` | Fetches the list of all scheduled appointments. |
| `POST` | `/api/appointments` | Creates a new appointment. Body: `{ patient_name, doctor_name, date }` |
| `PUT` | `/api/appointments/:id` | Updates the status of an appointment to "Confirmed". |

---

## 🔮 Future Improvements

If I were to expand this project further, I would implement:

* **Authentication:** Adding JWT-based auth for Doctors to manage their own schedules.
* **Real-time Updates:** Using **Cloudflare Durable Objects** (WebSockets) to update the appointment list instantly without refreshing.
* **Email Notifications:** Integrating **SendGrid** or **Cloudflare Email Routing** to send confirmation emails to patients.

---

### 👨‍💻 Developed by [MD WASI KHAN](https://mdwasikhan-portfolio.netlify.app/) 

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mdwasikhan54)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/mdwasikhan54)
</div>

If you find this project helpful, please drop a ⭐ star on the repo\!

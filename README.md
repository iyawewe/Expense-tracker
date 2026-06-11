# 💰 Mini Expense Tracker

A full-stack, responsive financial dashboard application designed to log monthly expenditures, track limits dynamically, visualize category breakdowns, and audit operations via an automated database ledger. 

**Live Demo URL:** [https://expense-tracker-1-cu7h.onrender.com](https://expense-tracker-1-cu7h.onrender.com)

---

## 📋 Project Title & Description
### Mini Expense Tracker (Full-Stack Personal Finance Workspace)
For this project, I chose to build a performance-focused, responsive personal finance manager with full database persistence and continuous automated auditing. The core motivation was to engineer an optimized frontend state synchronization workflow paired with a lightweight backend layer that tracks structural inputs in real-time. The solution enables individuals to input financial transactions, set and update custom budget caps dynamically, filter records comprehensively with multi-tiered combinations (search queries, explicit category buckets, and multi-axis sorting hooks), and analyze metrics instantly. It provides an embedded "AI Financial Accountant Roast" engine that assesses threshold compliance to deliver contextual feedback on user spending behavior.

---

## 🌐 Live Demo Links
* **Production Frontend App:** [https://expense-tracker-1-cu7h.onrender.com](https://expense-tracker-1-cu7h.onrender.com)
* **Production Backend Core Service:** [https://expense-tracker-backend-9y4t.onrender.com](https://expense-tracker-backend-9y4t.onrender.com)

---

## 🛠️ Tech Stack & Architecture Rationales

### Frontend Cluster
* **React & TypeScript:** Form the structural core. TypeScript guarantees compile-time type safety across database types, components, and payload shapes, minimizing runtime edge errors.
* **Tailwind CSS:** Used for writing utility-first inline styles to deliver an adaptive layout interface with explicit responsive grid break-points.
* **Lucide React:** Implements optimized, vector-scaled iconography across navigation links and status wrappers.
* **Recharts:** Used to create highly precise visual layers. It powers the interactive, animated vertical `BarChart` container that translates backend arrays into distinct category bars.
* **TanStack Router:** Provides strict type-safe frontend routing states (`Route.createFileRoute("/")`) ensuring isolated views.
* **Sonner:** Implements rich-color toast notifications to verify backend CRUD operations instantly.

### Backend Cluster & Storage
* **Bun & Elysia (or Node.js/Express Engine Framework):** Powers high-throughput routing interfaces with ultra-low initialization overhead.
* **SQLite & Bun SQL (Persistent Database Engine):** Serves as the storage layer, managing records inside a stable local `.sqlite` binary file. SQLite was selected because its serverless architecture ensures instantaneous disk execution, sub-millisecond query responses, and simplified migration pipelines.

---

## 💻 How to Run Locally

Follow these instructions to spin up the entire full-stack ecosystem locally. 

### Prerequisites
* Ensure you have **Node.js** (v18 or higher) and **Bun** installed on your system.

### 1. Clone and Extract Workspace
```bash
git clone [https://github.com/iyawewe/Expense-tracker](https://github.com/iyawewe/Expense-tracker)
cd Expense-tracker
```

### 2. Configure and Boot Backend Service
Open a terminal panel to establish your server instance:
```bash
cd server
npm install
bun --watch src/index.ts
```

### 3. Configure and Boot Frontend Workspace
```bash
Open a separate terminal panel alongside the backend instance:
cd ../client
npm install
npm run dev
```
## 🔌 API Documentation
👉 You can read the full endpoint parameters here: [API.md](./API.md)

## 📂 Project Structure

```text
expense-tracker/
├── client/                     # Frontend Application Scope (Vite + React TS Workspace)
│   ├── src/
│   │   ├── assets/             # Visual asset elements, icons, and profile media attachments
│   │   ├── components/         # Modular user interface components
│   │   │   ├── ui/             # Core visual design wrappers (Sonner toast configurations)
│   │   │   └── expense/        # Feature blocks (SummaryCards, ExpenseTable, ExpenseForm, Filters)
│   │   ├── lib/                # Utility modules (formatting engines, category structural mappings)
│   │   ├── routes/             # Client-side workspace pages and view components
│   │   │   └── index.tsx       # Primary workspace dashboard container file
│   │   └── services/
│   │       └── api.ts          # Unified base fetch API client router layer wrapper
│   ├── tailwind.config.js      # Layout design break-points and color systems
│   └── package.json            # Client package dependencies configuration
│
└── server/                     # Backend Application Scope (Bun Runtime Layer Engine)
    ├── database.sqlite         # Live local binary transactional storage ledger file
    ├── src/
    │   └── index.ts            # Main application setup, endpoints, and SQLite drivers
    └── package.json            # Server ecosystem package configuration
```

## 🚀 Next Steps & Future Enhancements

## 🛑 What Was Explicitly Deferred

𝗠𝘂𝗹𝘁𝗶-𝗨𝘀𝗲𝗿 𝗠𝘂𝗹𝘁𝗶-𝗧𝗲𝗻𝗮𝗻𝘁 𝗔𝘂𝘁𝗵𝗲𝗻𝘁𝗶𝗰𝗮𝘁𝗶𝗼𝗻: The system assumes a single developer workspace profiles frame layout environment. I chose to bypass JWT cookies or OAuth integration to keep data transactions lightweight and speed up delivery.

𝗧𝗿𝘂𝗲 𝗥𝗲𝗰𝘂𝗿𝗿𝗶𝗻𝗴 𝗕𝗶𝗹𝗹𝗶𝗻𝗴 𝗔𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗼𝗻 𝗘𝗻𝗴𝗶𝗻𝗲: Fixed itemized recurring sub-payments (like monthly SaaS hosting fees) must currently be entered manually each month instead of relying on a cron schedule.

## 🔮 What I Build Next

𝗧𝗿𝘂𝗲 𝗠𝗟-𝗗𝗿𝗶𝘃𝗲𝗻 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝘇𝗮𝘁𝗶𝗼𝗻 𝗣𝗿𝗲𝗱𝗶𝗰𝘁𝗶𝗼𝗻𝘀: Integrate a locally scoped text vector parsing engine within the /api/expenses route. This would analyze the user's transaction history notes array to automatically assign categories, eliminating manual category configuration dropdown errors.

𝗚𝗿𝗮𝗻𝘂𝗹𝗮𝗿 𝗗𝗮𝘁𝗲 𝗥𝗮𝗻𝗴𝗲 𝗖𝗼𝗺𝗽𝗮𝗿𝗮𝘁𝗶𝘃𝗲 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀 𝗣𝗮𝗻𝗲𝗹𝘀: Expand the Recharts data pipeline to generate comparative charts that contrast expenditures between different months or years, tracking your financial trajectory over time. -->

## SCREENSHORTS

<img width="1084" height="677" alt="Screenshot 2026-06-11 143232" src="https://github.com/user-attachments/assets/d9db2b52-3580-4891-a8b5-f5037646e1e1" />
<img width="1890" height="960" alt="Screenshot 2026-06-11 141304" src="https://github.com/user-attachments/assets/7cca8f48-24e3-4009-8276-1333de40c5ad" />
<img width="1871" height="963" alt="Screenshot 2026-06-11 141248" src="https://github.com/user-attachments/assets/bdc702b6-53a8-4bb5-b571-8e380d14eaff" />
<img width="1888" height="977" alt="Screenshot 2026-06-11 141227" src="https://github.com/user-attachments/assets/0bca4057-829e-47c4-b3da-be6644943679" />

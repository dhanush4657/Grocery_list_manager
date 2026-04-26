# 🛒 Grocery List Manager
 
A real-time collaborative grocery management web application for families and groups — built with the MERN stack.
 
---
 
## 📖 Overview
 
Managing grocery shopping across a household is often unorganized, leading to duplicate purchases and missed items. The **Grocery List Manager** solves this with a shared, real-time platform where multiple users can collaborate on a single grocery list from any device.
 
---
 
## ✨ Features
 
- **Collaborative Lists** — Shared grocery lists with multi-user access per group
- **Item Management** — Add, edit, and delete grocery items with category support
- **Purchase Tracking** — Mark items as purchased with visual cross-out indicators
- **Real-time Sync** — Instant updates across all connected devices (SSE / polling)
- **Group Privacy** — Access control ensures only group members can view their list
- **Email OTP Auth** — Secure two-step authentication via email OTP on register and login
---
 
## 🏗️ Architecture
 
The platform follows a **three-tier architecture** with real-time synchronization:
 
```
Frontend (React.js)
      ↓  API Requests / SSE
Backend (Node.js + Express.js)
      ↓  Database Queries
Database (MongoDB)
```
 
### Layers
 
**Frontend** — React.js UI with shared list view, item CRUD, category grouping, purchase checkboxes, and real-time auto-refresh.
 
**Backend** — Node.js + Express REST API handling list/item management, group-based access control, and real-time sync via SSE/polling.
 
**Database** — MongoDB storing users, groups, lists, and items via Mongoose ODM.
 
---
 
## 🗃️ Database Collections
 
| Collection | Key Fields |
|---|---|
| `users` | `_id`, `name`, `email`, `password`, `isVerified` |
| `groups` | `_id`, `groupName`, `members` (userIds) |
| `lists` | `_id`, `groupId`, `createdAt` |
| `items` | `_id`, `listId`, `name`, `category`, `isPurchased`, `updatedAt` |
| `otps` | `_id`, `email`, `otp`, `expiresAt` |
 
### ER Relationships
 
- `User → Group_Member` (1:N) — One user can belong to many groups
- `Group → Group_Member` (1:N) — One group can have many members
- `Group → Shopping_List` (1:N) — One group can have multiple lists
- `Shopping_List → List_Item` (1:N) — One list contains many items
- `User → Shopping_List` (1:N) — One user can create many lists
---
 
## 🔐 Authentication Flow
 
### Register
1. User submits name, email, and password
2. Account is created with `isVerified: false`
3. A 6-digit OTP is sent to the user's email
4. User enters the OTP → account verified → JWT issued
### Login
1. User submits email and password
2. Credentials are validated
3. A 6-digit OTP is sent to the user's email
4. User enters the OTP → JWT issued → redirected to dashboard
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- Node.js v18+
- MongoDB (local or Atlas)
- A Gmail account with [App Password](https://myaccount.google.com/apppasswords) enabled
### Installation
 
```bash
# Clone the repository
git clone https://github.com/your-username/grocery-list-manager.git
cd grocery-list-manager
 
# Install server dependencies
cd server && npm install
 
# Install client dependencies
cd ../client && npm install
```
 
### Environment Variables
 
Create a `.env` file inside the `server/` directory:
 
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/grocery_manager
JWT_SECRET=your_jwt_secret_here
 
# Nodemailer (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
APP_NAME=Grocery Manager
```
 
> **Gmail setup:** Enable 2-Step Verification on your Google account, then generate an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords). Use that 16-character password as `SMTP_PASS`.
 
### Running the App
 
```bash
# Start the backend (from /server)
npm run dev
 
# Start the frontend (from /client)
npm run dev
```
 
The client runs on `http://localhost:5173` and the server on `http://localhost:5000`.
 
---
 
## 📁 Project Structure
 
```
grocery-list-manager/
├── client/                     # React frontend
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── pages/              # Route-level pages
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   └── ...
│       ├── hooks/
│       ├── lib/
│       └── socket.js
│
└── server/                     # Node.js backend
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── itemController.js
    │   ├── listController.js
    │   └── groupController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── User.js
    │   ├── Otp.js
    │   ├── Group.js
    │   ├── List.js
    │   └── ListItem.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── itemRoutes.js
    │   ├── listRoutes.js
    │   └── groupRoutes.js
    ├── services/
    │   └── emailService.js
    └── index.js
```
 
---
 
## 🔌 API Endpoints
 
### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register and send email OTP |
| POST | `/api/auth/verify-email` | Verify OTP to activate account |
| POST | `/api/auth/login` | Login and send email OTP |
| POST | `/api/auth/verify-login-otp` | Verify OTP to receive JWT |
| POST | `/api/auth/resend-otp` | Resend OTP (verification or login) |
| GET | `/api/auth/me` | Get current user (protected) |
| PUT | `/api/auth/me` | Update profile (protected) |
 
### Lists & Items
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/lists/:groupId` | Get all lists for a group |
| POST | `/api/lists` | Create a new list |
| POST | `/api/items` | Add item to a list |
| PUT | `/api/items/:id` | Edit an item |
| DELETE | `/api/items/:id` | Delete an item |
| PATCH | `/api/items/:id/purchase` | Toggle purchased status |
 
---
 
## 🛠️ Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React.js, TailwindCSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, Nodemailer (Email OTP) |
| Real-time | Server-Sent Events (SSE) / Polling |
| Tools | Git, GitHub, Postman |
 
---
 
## 🗺️ Project Flow
 
1. **Register / Login** — User creates an account and verifies via email OTP
2. **Join / Create Group** — User joins a family or shopping group
3. **Create List** — A shared grocery list is created for the group
4. **Manage Items** — Members add, edit, or delete items with categories
5. **Real-time Sync** — All changes appear instantly for every group member
6. **Purchase Tracking** — Members mark items as purchased at the store

# User Post Address API

This project is a **REST API** that manages **Users**, their **Posts**, and their **Addresses**. It is built using:
- **Node.js** & **Express.js** for the backend.
- **Sequelize ORM** for database interaction.
- **SQLite** for local data storage.
- **TypeScript** for type safety.
- **Jest and Supertest** for unit testing.

---

## ⚙️ Features

- **User Management:** Create users, list users with pagination, fetch user details.
- **Post Management:** Create posts, fetch posts by user, delete posts.
- **Address Management:** Assign addresses to users, update user addresses, fetch user addresses.
- **Pagination Support:** User listing supports page size and page number.
- **Validation:** Schema validation using **Joi**.

---

## 📂 Folder Structure
📂 dist/
📂 src/
│
├── controllers/
│   ├── userController.ts
│   ├── postController.ts
│   └── addressController.ts
│
├── models/
│   ├── userModel.ts
│   ├── postModel.ts
│   └── addressModel.ts
│
├── routes/
│   ├── userRoutes.ts
│   ├── postRoutes.ts
│   └── addressRoutes.ts
│
├── utils/
│   └── utils.
|
├── library/                   
│   └── middlewares/
│       └── auth.ts|
│
├── config/
│   └── database.config.ts
│
├── app.ts
├── server.ts

---

## 🛠️ Setup and Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd user-post-address-api

## Install Dependency
npm install

## Configure .env
NODE_ENV=production
PORT=4000
JWT_SECRET= fagaggaaga*******ghhhh

## Tech Stack
Node.js - Backend framework
Express.js - Routing and request handling
TypeScript - Typed JavaScript
Sequelize - ORM for database access
SQLite - Lightweight embedded database
Joi - Schema validation
dotenv - Environment variable management

## Start Development Serer
npm run dev

## Start Production Serer
npm run start
npm run build
